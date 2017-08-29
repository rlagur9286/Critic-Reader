import json
import logging
import re

from bs4 import BeautifulSoup
from .news_parser import naver
from .news_parser import daum
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from urllib.request import urlopen
from .models import News
from .models import Reporter


stopword = set([('있', 'VV'), ('하', 'VV'), ('되', 'VV')])
email_reg = re.compile(r"(\w+[\w\.]*)@(\w+[\w\.]*)\.([A-Za-z]+)")
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
    '일부 네티즌', '일부 여론', '일각에서는', '일각에선', '한 네티즌은', '예상됩니다', '추측됩니다', '추정됩니다',
    '판단됩니다', '분석됩니다', '전망입니다', '지적이 나온다', '평가입니다', '라고 보인다', '라고 보입니다',
    '라고 나타났습니다', '것으로 알려졌습니다', '것으로 전해졌습니다', '업계에 따르면',
    ]


@csrf_exempt
def check_news(request):
    logger.debug(request)
    if request.method == 'POST':
        try:
            result = {}
            news_url = request.POST.get('news_url')
            yes = request.POST.get('yes')
            no = request.POST.get('no')

            news = News.objects.get(url=news_url)
            if yes:
                news.good += 1
                news.save()
            else:
                news.bad += 1
                news.save()

            result['num_of_person'] = str(news.good + news.bad)
            result['rate_of_news'] = str(news.good / (news.good + news.bad))
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

            title = refine_title
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
            email = re.search(email_reg, refine_text)
            if 'daum' in news_url:
                source_code_from_url = urlopen(news_url)
                soup = BeautifulSoup(source_code_from_url, "lxml")
                email = soup.select('#harmonyContainer > section > p')
                if email:
                    email = re.search(email_reg, str(email))
            if email:
                email = str(email).split('\'')[-2]
                print(email)
                reporter, created = Reporter.objects.get_or_create(email=email)
                news, created = News.objects.get_or_create(url=news_url, reporter=reporter)
                total = news.good + news.bad
                if news.checked == 1 and (news.good / (news.good + news.bad)) < 0.5:  # good -> bad
                    news.reporter.good += 1
                    news.reporter.bad += 1
                    if news.reporter.good + news.reporter.bad == 0:
                        news.reporter.star = 0
                    else:
                        news.reporter.star = int(round((news.reporter.good / (news.reporter.good + news.reporter.bad)) * 10))
                    news.checked = 2
                    news.save()
                    news.reporter.save()
                elif news.checked == 2 and (news.good / (news.good + news.bad)) >= 0.5:  # bad -> good
                    news.reporter.good += 1
                    news.reporter.bad += 1
                    if news.reporter.good + news.reporter.bad == 0:
                        news.reporter.star = 0
                    else:
                        news.reporter.star = int(round(news.reporter.good / (news.reporter.good + news.reporter.bad) * 10))
                    news.checked = 1
                    news.save()
                    news.reporter.save()
                elif news.checked == 0 and news.good + news.bad >= 100:
                    if (news.good / (news.good + news.bad)) > 0.5:
                        news.reporter.good += 1
                        news.reporter.bad += 1
                        if news.reporter.good + news.reporter.bad == 0:
                            news.reporter.star = 0
                        else:
                            news.reporter.star = int(round(news.reporter.good / (news.reporter.good + news.reporter.bad) * 10))
                        news.checked = 1
                        news.save()
                        news.reporter.save()
                    elif (news.good / (news.good + news.bad)) <= 0.5:
                        news.reporter.good += 1
                        news.reporter.bad += 1
                        if news.reporter.good + news.reporter.bad == 0:
                            news.reporter.star = 0
                        else:
                            news.reporter.star = int(round(news.reporter.good / (news.reporter.good + news.reporter.bad) * 10))
                        news.checked = 2
                        news.save()
                        news.reporter.save()

                if news.good == 0 and news.bad == 0 or (news.bad + news.good) == 0:
                    result['rate_of_news'] = None
                else:
                    result['rate_of_news'] = str(news.good / (news.good + news.bad))
                result['num_of_person'] = str(total)
                result['star'] = news.reporter.star
                result['email'] = news.reporter.email
                return JsonResponse({'success': True, 'result': result})
            else:
                return JsonResponse({'success': False, 'result': None})

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
            import random
            news = News.objects.all()
            for new in news:
                new.good += random.randint(1, 50)
                new.bad += random.randint(1, 150)
                if new.good >= new.bad:
                    new.changed = 1
                    new.reporter.good = new.good / 100
                else:
                    new.changed = 2
                    new.reporter.bad = new.bad / 100
                new.reporter.save()
                new.save()
            reporters = Reporter.objects.all()
            for re in reporters:
                total = re.good + re.bad

                if total == 0:
                    re.star = 1
                elif total < 0:
                    re.star = 0
                else:
                    re.star = int((re.good / (re.good + re.bad) * 5))
                if re.star > 5:
                    re.star = 5
                re.save()

            return JsonResponse({'success': True, 'result': None, 'reason': None})

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
            if te == '\r' or te == '\n':
                pass
            else:
                tmp1 += te
    for t in tmp1:
        txt += t
    return txt
