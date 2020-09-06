class LazyLoading {
    constructor(array, options) {
        this.start = 0;
        this.end = 10;
        this.array = array;
        this.len = array.length;
        this.last = false;
        this.bindEvents();
        this.init();
    }
    bindEvents() {
        this.template = this.template.bind(this);
    }

    init() {
        window.addEventListener("scroll", () => {
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                this.start = this.end;
                this.end += 10;
                this.lazyLoad('element');
            }
        });
    }
    _lazyLoadAsset(asset) {
        const src = asset.getAttribute(this.options.selector);
        if (!src) {
            return;
        }
        asset.src = src;
    }
    template(params) {
        let template = '<li>';
        if (params.url) {
            template += `<a class="news-title" href="${params.url}">${params.title}</a><br><span class="detail">`;
        }
        else {
            template += `<span class="news-title">${params.title}</span><br>`;
        }
        template += `<span class="news-description">${params.descendants} points by <a href="#user/${params.by}">${params.by}</a> `;
        template += `${getDays(params.time)} | ${(params.kids && params.kids.length) || 0} comments`
        template += "</span>";
        return template
    }
    lazyLoad = params => {
        const end = this.end;

        Promise.all(this.array.slice(this.start, this.end).map(obj => getResponse(`https://hacker-news.firebaseio.com/v0/item/${obj}.json`)))
            .then(story => {
                if (this.last) {
                    return false;
                }
                // let storyParsed = JSON.parse(story);
                let template = "";
                story.forEach(obj => {
                    const parsedObj = JSON.parse(obj);
                    template += this.template(parsedObj);
                });
                if (end + 10 < this.len) {
                    template += "<li id='emptyelement'></li>";
                }

                if (params) {
                    document.getElementById("emptyelement").outerHTML = template;
                    if (end + 10 > this.len) {
                        this.last = true;
                    }
                } else {
                    document.getElementById("content").innerHTML = `<ul>${template}</ul>`;
                }
            })

    }

}