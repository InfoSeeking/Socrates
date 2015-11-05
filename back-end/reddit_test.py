import modules
def testReddit():
    # Get a post from reddit.
    param = {
        "sub": "funny",
        "reddit_sorting": "hot",
        "count": 20
    };
    posts = modules.collection.reddit.fetchPosts(param)
    assert(len(posts) != 0)
    submission_id = posts[0]['id']
    assert(submission_id is not None)
    param = {
        'onlyTop': False,
        'submission_url': '',
        'submission_id': submission_id
    }
    comments = modules.collection.reddit.fetchComments(param)
    assert(len(comments) != 0)

def main():
    testReddit()

if __name__ == "__main__":
    main()