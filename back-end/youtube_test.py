import modules
from pprint import pprint
def testYoutube():
    param = {
        "query": "test",
        "order": "date"
    };
    posts = modules.collection.youtube.search(param)
    assert(len(posts) != 0)
    pprint(posts)

def main():
    testYoutube()

if __name__ == "__main__":
    main()