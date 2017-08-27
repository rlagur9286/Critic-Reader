from bs4 import BeautifulSoup
from urllib.request import urlopen


def get_news_header(url):
    #############################################################################
    #  News url 로부터 title 구하는 함수
    #############################################################################
    source_code_from_url = urlopen(url)
    soup = BeautifulSoup(source_code_from_url, "lxml")
    head = soup.select('#articleTitle')
    return head


def get_news_body(url):
    #############################################################################
    #  News url 로부터 body 구하는 함수
    #############################################################################
    source_code_from_url = urlopen(url)
    soup = BeautifulSoup(source_code_from_url, "lxml")
    body = soup.find('div', id='articleBodyContents')
    return body