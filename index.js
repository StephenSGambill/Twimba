import { tweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'


renderTweets()

document.addEventListener('click', (e) => {

    if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    } else if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    } else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    } else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    } else if (e.target.dataset.delete) {
        handleDeleteTweet(e.target.dataset.delete)
    }
})

function handleDeleteTweet(tweetId) {
    const foundIndex = tweetsData.findIndex((tweet) => tweet.uuid === tweetId)
    const tweetToDelete = tweetsData[foundIndex]

    const confirmModal = document.getElementById("confirmModal")
    const confirmDeleteButton = document.getElementById("confirmDelete")
    const cancelDeleteButton = document.getElementById("cancelDelete")

    confirmModal.style.display = "block"

    confirmDeleteButton.addEventListener("click", () => {
        tweetsData.splice(foundIndex, 1)
        renderTweets()
        confirmModal.style.display = "none"
    })

    cancelDeleteButton.addEventListener("click", () => {
        confirmModal.style.display = "none"
    })
}

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.filter((tweet) => {
        return tweetId === tweet.uuid
    })[0]//note this! instead of using [0] later, append to .filter

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    } else {
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    renderTweets()
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData.filter((tweet) => {
        return tweetId === tweet.uuid
    })[0]//note this! instead of using [0] later, append to .filter

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    } else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    renderTweets()
}

function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle("hidden")
}

function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input')

    if (tweetInput.value) {
        tweetsData.unshift({
            handle: "@Scrimba",
            profilePic: 'images/scrimbalogo.png',
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        renderTweets()
        tweetInput.value = ""
    }

}

function getFeedHtml() {
    let feedHtml = ``

    tweetsData.forEach((tweet) => {
        let likedIconClass = tweet.isLiked ? "liked" : ""
        let retweetedIconClass = tweet.isRetweeted ? "retweeted" : ""
        let repliesHtml = ''

        if (tweet.replies.length > 0) {
            tweet.replies.forEach((reply) => {
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                    </div>        
                    </div>
                </div>`
            })
        }

        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots" 
                                data-reply=${tweet.uuid}></i >
            ${tweet.replies.length}
                        </span >
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likedIconClass} "
                            data-like=${tweet.uuid}></i>
                                ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetedIconClass}"
                            data-retweet=${tweet.uuid}></i>
                            ${tweet.retweets}
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-regular fa-trash-can"
                        data-delete=${tweet.uuid}></i>
                        </span>
                        </div >
                    </div >
            </div >
                <div id='replies-${tweet.uuid}' class='hidden'> 
                ${repliesHtml}
            </div>
        </div > `
    })
    return feedHtml
}

function renderTweets() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

