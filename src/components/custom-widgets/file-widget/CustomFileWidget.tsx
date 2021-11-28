import React, {useEffect, useState} from 'react'
import firebase from '../../../util/Firebase'
import ImageViewer from 'react-simple-image-viewer';
import {Dialog} from "@mui/material";


const CustomFileWidget = (props: any) => {
    const {schema, value} = props;
    const [uploadedFiles, setUploadedFiles] = useState<any>({})
    const [currentFile, setCurrentFile] = useState("")
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [fileType, setFileType] = useState("")
    const [parsedValue, setParsedValue] = useState<any>({})

    useEffect(() => {
        if (value && Object.keys(value).length > 0) {
            console.log("value", value)
            const parsed = JSON.parse(value)
            setParsedValue(parsed)
            Object.keys(parsed).forEach(filename => {
                getDownloadUrl(parsed[filename])
                    .then(url => setUploadedFiles((prevState: any) => ({
                        ...prevState,
                        [filename]: {url: url, status: "complete"}
                    })))
            })
        }
    }, [value])

    const getDownloadUrl = (path: string) => {
        return firebase.storage().ref(path).getDownloadURL()
    }

    const handleFileClick = async (filename: string) => {
        const parsed = parsedValue;
        console.log("FILE CLICK VALUE", parsed)
        if (filename in parsed) {
            const path = parsed[filename];
            console.log(path)
            const metadata = await firebase.storage().ref().child(path).getMetadata()
            const type = metadata.contentType.split("/")[0]
            console.log("FILE TYPE", type)
            switch (type) {
                case "image":
                    setCurrentFile(uploadedFiles[filename].url);
                    setFileType(metadata.contentType);
                    setIsImageOpen(true);
                    break;
                case "video":
                    setCurrentFile(uploadedFiles[filename].url);
                    setFileType(metadata.contentType);
                    setIsVideoOpen(true);
                    break;
                default:
                    window.open(uploadedFiles[filename].url, '_blank');
            }
        }
    }

    const closeViewer = () => {
        setCurrentFile("")
        setFileType("");
        setIsImageOpen(false);
        setIsVideoOpen(false);
    };

    return (
        <div>
            {isImageOpen && <ImageViewer
                src={[currentFile]}
                disableScroll={false}
                backgroundStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)"
                }}
                closeOnClickOutside={true}
                onClose={closeViewer}
            />}
            <Dialog
                open={isVideoOpen}
                onClose={closeViewer}
                fullWidth={true}
            >
                <video height="360px" controls>
                    <source src={currentFile} type={fileType}/>
                    Your browser does not support the video tag.
                </video>
            </Dialog>

            <label className={"form-label"}>{schema?.title}</label>
            <br/>

            {Object.keys(uploadedFiles).map((filename, i) =>
                <div key={filename}>
                    <div style={{display: "flex", alignItems: "baseline"}}>
                        <p>{filename}</p>
                        {uploadedFiles[filename].status === 'complete' &&
                        <div style={{display: "flex", alignItems: "baseline"}}>
                            <button
                                onClick={() => handleFileClick(filename)}
                                style={{fontSize: "14px", padding: 0, margin: "0 10px"}}
                                type="button"
                                className="btn btn-link text-success"
                            >
                                посмотреть файл
                            </button>
                        </div>
                        }
                    </div>
                </div>
            )}
        </div>
    )
}

export default CustomFileWidget