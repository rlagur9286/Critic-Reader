from konlpy.tag import Twitter
from news.models import News
from konlpy.tag import Komoran
from konlpy.tag import Kkma
from pprint import pprint
import nltk
import pickle

pos_tagger = Twitter()


def read_data(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        data = [line.split('/') for line in f.read().splitlines()]
        data = data[1:]   # header 제외
    return data


def tokenize(doc):
    result = []
    for t in pos_tagger.pos(doc):
        result.append(t)
    return result


def term_exists(doc):
    return {'exists({})'.format(word): (word in set(doc)) for word in selected_words}



if __name__ == '__main__':
    train_data = read_data('ratings_train.txt')

    train_docs = [(tokenize(row[0]), row[1]) for row in train_data]
    with open('train_docs', 'wb') as f:
        pickle.dump(train_docs, f)
    # 잘 들어갔는지 확인
    tokens = [t for d in train_docs for t in d[0]]
    text = nltk.Text(tokens, name='NMSC')
    selected_words = [f[0] for f in text.vocab()]

    with open('model', 'wb') as f:
        pickle.dump(selected_words, f)

    train_xy = [(term_exists(d), c) for d, c in train_docs]
    classifier = nltk.NaiveBayesClassifier.train(train_xy)

    test_sentence = tokenize('이는 국민 대다수의 여론이 탄핵을 지지했고 여전히 그와 같은 분위기라는 점을 언급한 것으로 보인다')
    print(test_sentence)
    print(classifier.classify(term_exists(test_sentence)))

