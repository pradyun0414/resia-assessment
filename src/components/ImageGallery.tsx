
AWS.config.update({
    region: 'us-east-2',
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:0b298698-c4f6-4d42-b636-891b11768e12'
    })
});

import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import AWS from 'aws-sdk';
import { list } from 'aws-amplify/storage';
import { Button, Flex, Input, View, Text } from '@aws-amplify/ui-react';

import ImageCard from './ImageCard';

const s3 = new AWS.S3();

const fetchImageKeys = async () => {
    try {
        const result = await list({
            path: 'public/',
        });
        const keys = result.items.map((item) => item.path);
        return keys;
    } catch (error) {
        console.error('Error fetching image keys:', error);
        return [];
    }
};

const fetchImageUrls = async (keys: any) => {
    const urls = await Promise.all(
        keys.map(async (key: any) => {
            const params = { Bucket: 'resiabucket62f1b-dev', Key: key };
            const url = await s3.getSignedUrlPromise('getObject', params);
            return { key, url };
        })
    );
    return urls;
};

function ImageGallery(props:any) {

    const uploadingState = props.uploadingState;
    const setUploadingState = props.setUploadingState;

    interface Image {
        imageKey: string;
        key: string;
        url: string;
    }

    const [images, setImages] = useState<Image[]>([]);

    const loadImages = async () => {
        const keys = await fetchImageKeys();
        const urls = await fetchImageUrls(keys);
        setImages(urls);
    };

    useEffect(() => {
        if(uploadingState) {
            loadImages();
            setUploadingState(false);
        }
    }, [uploadingState]);

    useEffect(() => {
        loadImages();
    }, []); // empty depewndency array but i tried putting 'images' in here

    const handleRename = async (oldKey: string, newKey: string) => {
        try {
            await s3.copyObject({
                Bucket: 'resiabucket62f1b-dev',
                CopySource: `resiabucket62f1b-dev/${oldKey}`,
                Key: newKey,
            }).promise();
            await s3.deleteObject({
                Bucket: 'resiabucket62f1b-dev',
                Key: oldKey,
            }).promise();

            // update local images
            setImages((prevImages) =>
                prevImages.map((img) =>
                    img.imageKey === oldKey ? { ...img, imageKey: newKey } : img
                )
            );
        } catch (error) {
            console.error('Error renaming image:', error);
        }
    };

    const handleDelete = async (imageKey: string) => {
        try {
            await s3.deleteObject({
                Bucket: 'resiabucket62f1b-dev',
                Key: imageKey,
            }).promise();

            // update local images
            setImages((prevImages) => prevImages.filter((img) => img.imageKey !== imageKey));
            loadImages();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    // chatgpt gave me this
    const breakpointColumnsObj = {
        default: 4, // 4 columns by default
        1600: 3, // 3 columns for screens wider than 1100px
        1200: 2,  // 2 columns for screens wider than 700px
        800: 1   // 1 column for screens wider than 500px
    };

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
            style={{
                display: 'flex',
                // marginLeft: '-30px', // column spacing
                width: 'auto',
                // padding: '1rem', // grid padding
            }}
        >
            {images.map(({ key, url }) => (
                <div
                    key={key}
                    style={{
                        // paddingLeft: '30px', // column spacing
                        backgroundClip: 'padding-box',
                    }}
                >
                    <ImageCard
                        imageKey={key}
                        url={url}
                        onRename={handleRename}
                        onDelete={handleDelete}
                    />
                </div>
            ))}
        </Masonry>
    );

};

export default ImageGallery;
