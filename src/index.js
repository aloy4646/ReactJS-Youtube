import React from "react"
import ReactDOM from "react-dom/client"
import youtube from "./youtube"

const el = document.getElementById("root")

// tell react to take control of that element
const root = ReactDOM.createRoot(el)

class SearchBar extends React.Component{
    state = { term: "" }

    onFormSubmit = (event) => {
        event.preventDefault()

        this.props.onSubmit(this.state.term)
    }

    render(){
        return(
            <div className="ui segment" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                <form onSubmit={this.onFormSubmit} className="ui form">
                    <div className="field">
                        <label>Videos Search
                            <input 
                                type="text" 
                                value={this.state.term} 
                                onChange={(event) => this.setState({term: event.target.value})}
                            />
                        </label>
                    </div>
                </form>
            </div>
        )
    }
}

class VideoItem extends React.Component{
    handleClick = () => {
        this.props.onSelectVideo(this.props.video)
    }

    render(){
        const video = this.props.video
        return (
            <div onClick={this.handleClick} style={{ display: 'flex', flexDirection: 'column' , cursor: 'pointer' }}>
                <img
                    className='image'
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    style={{ width: '100%' }}
                />
                <div>
                    <h3 style={{ width: '100%' }}>{video.snippet.title}</h3>
                </div>
            </div>
        )
    }
}


class ListVideo extends React.Component{
    render(){
        const videos = this.props.videos.map(video => {
        return (
                <div>
                    <VideoItem
                        key={video.id.videoId}
                        video={video}
                        onSelectVideo={this.props.onSelectVideo}
                    />
                    <br></br>
                    <br></br>
                </div>
            )
        })

        return (
            <div>{videos}</div>
        )
    }
}

class DetailVideo extends React.Component {
    render(){
        const videoSrc = `https://www.youtube.com/embed/${this.props.selectedVideo.id.videoId}`

        return (
            <div>
                <div>
                    <iframe 
                        title='video player' 
                        src={videoSrc} 
                        style={{ 
                            width: '100%',
                            maxWidth: '856px', 
                            height: 'calc(100vw * 9 / 16)',
                            maxHeight: '480px'
                        }}
                        allowFullScreen
                    />
                </div>
                <div>
                    <h2 className='header'>{this.props.selectedVideo.snippet.title}</h2>
                    <p>{this.props.selectedVideo.snippet.description}</p>
                </div>
            </div>
        )
    }
}

class App extends React.Component{
    state = { 
        videos: [],
        selectedVideo: null
    }

    setSelectedVideo = (video) => {
        this.setState({selectedVideo: video})
    }

    onSearchSubmit = async (term) => {
        const response = await youtube.get("/search", {
            params: {
                q: term
            }
        })

        this.setState({ videos: response.data.items }, () => {
            console.log(this.state.videos)
            this.setState({selectedVideo: this.state.videos[0]}, () => {
                console.log(this.state.selectedVideo)
                console.log(this.state.selectedVideo.snippet.thumbnails.medium.url)
            })
        })
    }

    componentDidMount(){
        this.onSearchSubmit("pow patrol")
    }

    render() {
        return (
            <div className="ui container" style={{ marginTop: "10px"}}>
                <SearchBar onSubmit={this.onSearchSubmit} />
                <div style={{ marginTop: "10px", display: "flex" }}>
                    <div style={{ flex: "2", marginRight: "20px" }}>
                    {this.state.videos.length > 0 && (
                        <div>
                        {this.state.selectedVideo && (
                            <div>
                            <DetailVideo
                                selectedVideo={this.state.selectedVideo}
                            />
                            </div>
                        )}
                        </div>
                    )}
                    </div>
                    
                    <div style={{ flex: "1" }}>
                    {this.state.videos.length > 0 && (
                        <ListVideo
                            videos={this.state.videos}
                            onSelectVideo={this.setSelectedVideo}
                        />
                    )}
                    </div>
                </div>
            </div>
        )
      }
}

root.render(<App />)