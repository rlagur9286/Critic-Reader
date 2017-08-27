from bs4 import BeautifulSoup
from urllib.request import urlopen


def get_news_body(url):
    #############################################################################
    #  News url 로부터 title 구하는 함수
    #############################################################################
    source_code_from_url = urlopen(url)
    soup = BeautifulSoup(source_code_from_url, "lxml")
    body = soup.select('#harmonyContainer > section')
    return body[0]


def get_news_header(url):
    #############################################################################
    #  News url 로부터 body 구하는 함수
    #############################################################################
    source_code_from_url = urlopen(url)
    soup = BeautifulSoup(source_code_from_url, 'lxml', from_encoding='utf-8')
    head = soup.select('#cSub > div.head_view > h3')
    # body = soup.find('div', {'class': 'head_view'}).find('h3', {'class': 'tit_view'}).text
    return head[0]

if __name__ == '__main__':
    print(get_news_header('http://v.media.daum.net/v/20170826203503246'))
    print(get_news_body('http://v.media.daum.net/v/20170826203503246'))
