var selectedTab = "";
var stories = [];
(function () {
    selectedTab = (window.location.hash).replace("#", "") || "topstories";
    selectTab(selectedTab);
})();

window.onhashchange = function(){
    selectedTab = (window.location.hash).replace("#", "") || "topstories";
    selectTab(selectedTab);
}

function selectTab(tab = "topstories") {
    selectedTab = tab;
    document.querySelectorAll(".topnav a").forEach(obj => obj.classList.remove("active"));
    const tabDiv = document.getElementById(`tab_${tab}`) || document.getElementById(`tab_ware`);
    tabDiv.classList.add("active");
    renderHtml(loader());
    if (/login|createAccount/.test(selectedTab)) {
        var obj = new Form(selectedTab);
        obj.renderHtml();
    }
    else if (/user/.test(selectedTab)) {
        const user = selectedTab.split("/")[1] || 'user';
        userDetail(user);
    }
    else {
        renderStory(selectedTab);
    }
}

function userDetail(user) {
    let template = ""
    renderHtml(loader());
    getResponse(`https://hacker-news.firebaseio.com/v0/user/${user}.json`)
        .then(res => {
            document.getElementById("tab_ware").innerText = `User ${user}`;
            const response = JSON.parse(res);
            template += "<div class='user-detail'>";
                template += `<p> About : ${response.about} </p>`;
                template += `<p> karma : ${response.karma||""} </p>`;
                template += `<p> Created On : ${getDays(response.created)} </p>`;
                template += `<p> Comments : ${response.submitted.length} </p>`;
                template += "</div>";
                renderHtml(template);
        })
}

function renderStory(story) {
    getResponse(`https://hacker-news.firebaseio.com/v0/${story}.json`)
        .then(res => {
            stories = JSON.parse(res);
            const obj = new LazyLoading(stories);
            obj.lazyLoad();
        })
}

function getDays(time) {
    const date = Math.round((new Date() - new Date(time * 1000)) / (1000 * 60 * 60 * 24));
    let days = 'Today';

    if (date >= 1) {
        days = `${date} day${(date > 1 && 's') || ''} ago`;
    }
    return days;
}

function renderHtml(template) {
    document.getElementById("content").innerHTML = template;
}

function loader() {
    return '<div class="spinner-box"><div class="circle-border"><div class="circle-core"></div></div></div>';
}

function getResponse(url) {
    return fetch(url)
        .then(res => {
            if (!res.ok) {
                throw res.statusText;
            }
            return res;
        })
        .catch(err => {
            throw err;
        })
        .then(res => {
            if (res.url.indexOf(".html")) {
                return res.text();
            }
            return res.json();
        })
        .catch(err => {
            throw err;
        })
}