import React, {useState} from 'react'
import styled from 'styled-components'

const Main = ({uploadImage, images, tipOwner}) => {
    const [file, setFile] = useState(null)
    const [description, setdescription] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        if (!file || !description) {
            window.alert("All fields are required!")
            return
        }
        let data = {}
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            data = {buffer: Buffer(reader.result)}
            data = {...data, description}
            uploadImage(data)
        }
    }

    return (
        <Wrapper>
            <div className="upload-section shadow card">
                <h1>Share Image</h1>
                <form onSubmit={onSubmit}>
                    <input 
                        type="file" 
                        accept=".jpg, .jpeg, .png, .bmp, .gif"
                        className="file"
                        onChange={e => setFile(e.target.files[0])}
                    />
                    <div className="button-wrap">
                        <label className="new-button" htmlFor="upload"> {file ? file.name : "Upload Image"}
                            <input 
                                id="upload"
                                type="file" 
                                accept=".jpg, .jpeg, .png, .bmp, .gif"
                                className="file"
                                onChange={e => setFile(e.target.files[0])}
                            />
                        </label>
                    </div>
                    <br/>
                    <textarea
                        className="text"
                        placeholder="Enter Description"
                        onChange={(e) => setdescription(e.target.value)}
                        value={description}
                    />
                    <button
                        type="submit"
                        className="btn"
                    >
                        Upload!
                    </button>
                </form>
            </div>
            {images &&
                <div className="posts-section">
                    <h1>Posts</h1>
                    {images.map((post, i) => (
                        <div key={i} className="shadow card post-card">     
                            <div className="author">
                                <p className="icon">A</p>
                                <small>{post.author}</small>
                            </div>
                            <div className="image-section">
                                <img src={`https://ipfs.infura.io/ipfs/${post.hash}`}/>
                            </div>
                            <div className="bottom-section">
                                <p className="description">{post.description}</p>
                                <hr/>
                                <div className="tip">
                                    <p>TIPS: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH</p>
                                    <button 
                                        onClick={() => tipOwner(post.id)}   
                                    >
                                        TIP: 0.1 ETH
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </Wrapper>
    )
}

export default Main

const Wrapper = styled.div`
    margin-top: 6vh;
    button {
        cursor: pointer;
    }
    .shadow {
        box-shadow: 5px 5px 8px rgba(0,0,0,0.1);
    }
    .card {
        background-color: #fff;
        border-radius: .6rem;
        padding: .5rem;
    }
    .upload-section {
        text-align: center;
        padding: 1rem; 
        h1 {
            font-size: 1.5rem;
            letter-spacing: .1rem;
        }
        .text {
            padding: .3rem;
            border-radius: .2rem;
            margin-bottom: 1rem;
            border: 1px solid #ccc;
            width: 100%;
            outline:none;
        }

        .new-button {
            display: inline-block;
            padding: 8px 12px; 
            cursor: pointer;
            border-radius: 4px;
            background-color: #9c27b0;
            font-size: .8rem;
            color: #fff;
            margin-top: 1rem;
            width: 100%;
        }
        input[type="file"] {
            position: absolute;
            z-index: -1;
            top: 6px;
            left: 0;
            font-size: 15px;
            color: rgb(153,153,153);
        }
        .button-wrap {
            position: relative;
        }
        
        .btn {
            display: block;
            text-align: center;
            margin: 0 auto;
            border: none;
            padding: .3rem 1rem;
            letter-spacing: .1rem;
            font-weight: bold;
            font-size: 1rem;
            background-color: #6ae5d4;
            border-radius: .5rem;           
            outline:none;
            margin-bottom: 1rem;
            :hover {
                box-shadow: 4px 4px 8px rgba(0,0,0,0.1);
            } 
        }
    }
    .posts-section {
        margin-top: 1rem;
        h1 {
            font-size: 1.6rem;
            letter-spacing: 1px;
            text-align: center;
            margin-bottom: .6rem;
        }
        .post-card {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            margin-bottom: 1rem;
            hr {
                margin: 1rem 0;
            }
            .author {
                margin-bottom: 1rem;
                padding-bottom: .5rem;
                border-bottom: 1px solid rgba(0,0,0,0.4);
                display: flex;
                .icon {
                    background-color: red;
                    width: 1.2rem;
                    height: 1.2rem;
                    text-align: center;
                    border-radius: 50%;
                    font-weight: bold;
                    font-size: .8rem;
                    margin-right: .5rem;    
                    color: #fff;
                }
            }
            .image-section{
                height: 20rem;
                width: 100%;
                text-align: center;
                img {
                    object-fit: contain;
                    height: 100%;
                    width: 100%;
                }
            }
            .bottom-section {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .description {
                    margin-top: .6rem;
                }
                .tip {
                    display: flex;
                    justify-content: space-between;
                    button {
                        outline: none;
                        border: none;   
                        padding: .2rem;
                        border-radius: .4rem;
                        background-color: tomato;
                        color: #fff;
                        font-weight: bold;
                        letter-spacing: 1px;
                        :hover {
                            box-shadow: 3px 4px 8px rgba(0,0,0,0.1);
                        }
                    }
                }
            }
        }
    }
`