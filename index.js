// Could be replaced with URL, inputs or other means of pagination
let LIMIT = 20
let PAGE = 1

const requestVideos = $.get(`https://jsonplaceholder.typicode.com/photos?_limit=${LIMIT}&_page=${(LIMIT * PAGE) - LIMIT}`)

class VideoList{
  constructor(holder, videos=[]){
    this.videos = []
    this.holder = holder
    videos.forEach((video) => this.addVideo(video))
  }
  addVideo(video){
    video = new Video(video)
    this.holder.append(video.el)
    this.videos.push(video)
  }
}

class Video{
  constructor(video){
    this._data = video
    this.el = $('<div>', {id: `video-${video.id}`, 'class':'video'})

    if(video.thumbnailUrl){
      this.thumb = new VideoThumb(this, video.thumbnailUrl)
      this.el.append(this.thumb.el)
    }

    return this
  }
  getTitle(){
    return this._data.title
  }
}

class VideoThumb{
  constructor(parent, src){
    this._src = src
    this.parent = parent
    this.el = $('<img>', {'class':'thumb', 'src': src})

    this.el.click((event) => this.clicked(event))
    return this
  }
  clicked(event){
    event.stopPropagation();

    if(descriptionComponent){
      descriptionComponent.hide(() => {
        this.parent.el.append(descriptionComponent.el)
        descriptionComponent.show(this.parent.getTitle())
      })
    }
  }
}

class DescriptionComponent{
  constructor(){
    $(document).click(() => this.hide())
    this.el = $('<div>', {'id':'description-singleton'}).text('I AM HERE!!')
  }
  hide(cb){
    this.el.fadeOut(cb)
  }
  show(title, cb){
    if(title) this.el.text(title)
    this.el.fadeIn(cb)
  }
}

// The above classes could be part of a larger library of components in a component driven front-end

let list = descriptionComponent = null

requestVideos.done((videos) =>{
  list = new VideoList($('#videos'), videos)
  descriptionComponent = new DescriptionComponent()
})
