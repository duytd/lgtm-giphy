import * as React from "react"
import * as ReactDOM from "react-dom"
import axios from 'axios';

import "../styles/popup.css"

class Hello extends React.Component<{}, { images: Array<any> }> {
    constructor(props) {
        super(props);
        this.state = {
            images: []
        };

        this.fetchImages('lgtm');
    }

    render() {
        const image = this.getRandomImage(this.state.images);

        return (
            <div>
                <input type="text" className="search-input" onChange={(e) => this.search(e)} />
                {image ? this.renderImage(image) : ""}
            </div>
        )
    }

    renderImage(image) {
        return (
            <a onClick={() => this.attachImage(image)}>
                <img src={image.images.downsized_large.url} alt={image.title} />
            </a>
        )
    }

    search(event: any): void {
        const query = event.target.value;

        if (query.length > 1) {
            this.fetchImages(query);
        }
    }

    attachImage(image) {
        const script = `
            var activeElement = document.activeElement;
            var markdown = '![${image.title}](${image.images.downsized_large.url})';

            if (activeElement && ['pull_request_review[body]', 'comment[body]'].indexOf(activeElement.name) !== -1) {
                activeElement.value += markdown;
            }
        `;

        chrome.tabs.executeScript({
            code: script
        });
    }

    fetchImages(query) {
        const endpoint = 'https://api.giphy.com/v1'
        const apiKey = process.env.GIPHY_API_KEY;
        const uri = `${endpoint}/gifs/search?api_key=${apiKey}&q=${query}&limit=25&offset=0&rating=G&lang=en`

        axios.get(uri)
            .then(res => {
                  const images = res.data.data;

                  this.setState({ images });
            })
    }

    getRandomImage(images) {
        const i = Math.floor(Math.random() * images.length) + 1;

        return images[i];
    }
}

// --------------

ReactDOM.render(
    <Hello />,
    document.getElementById('root')
)
