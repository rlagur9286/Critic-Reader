import json
import logging
import re

from bs4 import BeautifulSoup
from .news_parser import naver
from .news_parser import daum
from . TextRanker import RawSentenceReader
from . TextRanker import TextRank
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from urllib.request import urlopen
from konlpy.tag import Komoran

stopword = set([('있', 'VV'), ('하', 'VV'), ('되', 'VV')])

logging.basicConfig(
    format="[%(name)s][%(asctime)s] %(message)s",
    handlers=[logging.StreamHandler()],
    level=logging.INFO
)
logger = logging.getLogger(__name__)
logger.setLevel(level=logging.DEBUG)

good_list = [
    '확인 결과', '조사 결과', '취재 결과', '확인됐다', '발표했다', '사실이 드러났다', '상태였다'
    ]
bad_list = [
    '예상된다', '추측된다', '추정된다', '판단된다', '분석된다', '전망이다', '지적이다', '지적이 나옵니다'
    '평가다', '것으로 보인다', '것으로 보입니다', '것으로 나타났다', '라고 알려졌다', '라고 전해졌다', '라는 후문이다',
    '라는 전언이다', '일파만파', '분석이 지배적이다', '의도로 보인다', '많은 전문가들은', '관계자에 따르면', '다수의 누리꾼들은'
    '일부 네티즌', '일부 여론', '일각에서는', '일각에선', '한 네티즌은'
    ]


@csrf_exempt
def check_news(request):
    logger.debug(request)
    if request.method == 'POST':
        try:
            result = {}
            data = json.loads(request.body.decode('utf-8'))
            logger.debug("INPUT %s", data)
            news_url = data.get('news_url')

            return JsonResponse({'success': True, 'result': result})

        except Exception as exp:
            logger.exception(exp)
            return JsonResponse({'success': False, 'reason': 'INTERNAL SERVER ERROR'})

    if request.method == 'GET':
        try:
            result = {}
            data = json.loads(json.dumps(request.GET))
            logger.debug("INPUT : %s", data)
            news_url = data.get('news_url')
            if 'daum' in news_url:
                refine_text = str(daum.get_news_body(news_url))
                refine_title = str(daum.get_news_header(news_url))
            else:
                refine_text = str(naver.get_news_body(news_url))
                refine_title = str(naver.get_news_header(news_url))

            # 원본 기사를 체로 거른다!
            trust_words = []
            critic_words = []
            for good in good_list:
                refine_text = good_retext(good, refine_text, trust_words)
                refine_title = good_retext(good, refine_title, trust_words)

            for bad in bad_list:
                refine_text = bad_retext(bad, refine_text, critic_words)
                refine_title = bad_retext(bad, refine_title, critic_words)

            result['text'] = refine_text
            result['header'] = refine_title
            result['critic_cnt'] = len(critic_words)
            result['trust_cnt'] = len(trust_words)
            result['critic_words'] = list(set(critic_words))
            result['trust_words'] = list(set(trust_words))
            return JsonResponse({'success': True, 'result': result})

        except Exception as exp:
            logger.exception(exp)
            logger.debug("RETURN : FALSE - EXCEPTION")
            return JsonResponse({'success': False, 'reason': 'INTERNAL SERVER ERROR'})


@csrf_exempt
def summary(request):
    logger.debug(request)
    if request.method == 'POST':
        try:
            result = {}
            data = json.loads(request.body.decode('utf-8'))
            logger.debug("INPUT %s", data)
            news_url = data.get('news_url')

            return JsonResponse({'success': True, 'result': None, 'reason': None})

        except Exception as exp:
            logger.exception(exp)
            return JsonResponse({'success': False, 'reason': 'INTERNAL SERVER ERROR'})

    if request.method == 'GET':
        try:
            result = {}
            data = json.loads(json.dumps(request.GET))
            logger.debug("INPUT : %s", data)
            news_url = data.get('news_url')
            refine_text = str(get_news_text(news_url))
            refine_header = str(naver.get_news_header(news_url))
            tr = TextRank()
            tagger = Komoran()
            with open('media/upload/tmp.txt', 'w', encoding='utf-8') as f:
                f.write(refine_text)
            tr.loadSents(RawSentenceReader('media/upload/tmp.txt'),
                         lambda sent: filter(lambda x: x not in stopword and x[1] in ('NNG', 'NNP', 'VV', 'VA'),
                                             tagger.pos(sent)))
            tr.build()
            ranks = tr.rank()

            result['summary'] = tr.summarize(0.3)
            result['header'] = refine_header

            return JsonResponse({'success': True, 'result': result, 'reason': None})

        except Exception as exp:
            logger.exception(exp)
            logger.debug("RETURN : FALSE - EXCEPTION")
            return JsonResponse({'success': False, 'reason': 'INTERNAL SERVER ERROR'})


def get_news_list(url):
    #############################################################################
    #  News 헤더와 url 얻어오는 함수
    #############################################################################
    news_url = []
    news_header = []
    source_code_from_url = urlopen(url)
    soup = BeautifulSoup(source_code_from_url, 'lxml', from_encoding='utf-8')
    for page in soup.find_all('div', id='main_content'):
        main = page.find('div').find_all('div')
        for m in main:
            for news in m.find_all('dl'):
                if news.find('a') is not None:
                    news_url.append(news.find('a')['href'])
                    tmp = news.find('a', text=True).find(text=True)
                    news_header.append(re.sub('[\n\r\t\{\}\[\]\/?,;:|\)*~`!^\-_+<>\#$%&\\\=\(\'\"]', '', tmp))
    return news_url, news_header


def good_retext(good, original_text, critic_words):
    if re.findall(good, original_text):
        for _ in range(len(re.findall(good, original_text))):
            critic_words.append(good)
        return original_text.replace(good, '<span class="trust">' + good + '</span>')
    else:
        return original_text


def bad_retext(bad, original_text, critic_words):
    if re.findall(bad, original_text):
        for _ in range(len(re.findall(bad, original_text))):
            critic_words.append(bad)
        return original_text.replace(bad, '<span class="fiction">' + bad + '</span>')
    else:
        return original_text


def get_news_text(url):
    #############################################################################
    #  News url 로부터 body 구하는 함수
    #############################################################################
    tmp1 = ''
    txt = ''
    source_code_from_url = urlopen(url)
    soup = BeautifulSoup(source_code_from_url, 'lxml', from_encoding='utf-8')

    for body_text in soup.find_all('div', id='articleBodyContents'):
        for te in body_text.find_all(text=True):
            tmp1 += te
    for t in tmp1:
        txt += t
    return txt


