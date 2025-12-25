import _ from "lodash";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import SearchBar from "./components/search_bar";
import VideoList from "./components/video_list";
import VideoDetail from "./components/video_detail";

const API_KEY = "AIzaSyAFh-ph-wFGcnHa3SSNpEbPtrBntDtGRsA";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      selectedVideo: null,
      error: null,
    };
  }

  componentDidMount() {
    this.videoSearch("four-cross");
  }

  videoSearch(term) {
    axios
      .get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          q: term,
          key: API_KEY,
          type: "video",
          maxResults: 10,
        },
      })
      .then((response) => {
        this.setState({
          videos: response.data.items,
          selectedVideo: response.data.items[0],
          error: null,
        });
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        let errorMessage = "An error occurred while fetching videos.";

        if (error.response) {
          const errorData = error.response.data;
          if (errorData.error && errorData.error.message) {
            errorMessage = errorData.error.message;
          }
        }

        this.setState({
          error: errorMessage,
          videos: [],
          selectedVideo: null,
        });
      });
  }

  render() {
    const videoSearch = _.debounce((term) => {
      this.videoSearch(term);
    }, 300);

    return (
      <div>
        <SearchBar onSearchTermChange={videoSearch} />
        {this.state.error && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {this.state.error}
            {this.state.error.includes("quota") && (
              <div style={{ marginTop: "10px" }}>
                <p>Your YouTube API quota has been exceeded. Options:</p>
                <ul>
                  <li>
                    Wait until the quota resets (usually at midnight Pacific
                    Time)
                  </li>
                  <li>Request a quota increase in Google Cloud Console</li>
                  <li>Use a different API key</li>
                </ul>
                <p>
                  <small>
                    Check your quota usage at:{" "}
                    <a
                      href="https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Cloud Console
                    </a>
                  </small>
                </p>
              </div>
            )}
          </div>
        )}
        <VideoDetail video={this.state.selectedVideo} />
        <VideoList
          onVideoSelect={(selectedVideo) => this.setState({ selectedVideo })}
          videos={this.state.videos}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector(".container"));
