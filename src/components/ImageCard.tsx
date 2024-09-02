import React, { useEffect, useState } from 'react';
import { Button, Input, Flex, View, Text } from '@aws-amplify/ui-react';
import AWS from 'aws-sdk';
import { MdClose } from "react-icons/md";

AWS.config.update({
    region: 'us-east-2',
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:7d094e7e-966e-48d4-9b56-ed45e4d1af1f'
    })
});

const rekognition = new AWS.Rekognition();

async function getAICaption(imageKey: string) {
    const params = {
        Image: {
            S3Object: {
                Bucket: 'resia1c957d8a142a47b4975cc0a5c19a24ac6a12b-dev',
                Name: imageKey,
            },
        },
        MaxLabels: 5,
        MinConfidence: 80,
    };

    try {
        const data = await rekognition.detectLabels(params).promise();
        if (data.Labels && data.Labels.length > 0) {
            return data.Labels.map(label => label.Name).join(', ');
        } else {
            return 'No caption available';
        }
    } catch (error) {
        console.error('error detecting labels:', error);
        return 'No caption available';
    }
};


interface ImageCardProps {
    imageKey: string;
    url: string;
    onRename: (oldKey: string, newKey: string) => void;
    onDelete: (imageKey: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageKey, url, onRename, onDelete }) => {

    const [isHovered, setIsHovered] = useState(false);
    const [caption, setCaption] = useState('Loading caption...');

    const [renameValue, setRenameValue] = useState(() => {
        const filename = imageKey ? imageKey.split('/').pop() : '';
        return filename || '';
    });

    useEffect(() => {
        const fetchCaption = async () => {
            const aiCaption = await getAICaption(imageKey);
            setCaption(aiCaption);
        };

        fetchCaption();
    }, [imageKey]);

    const handleRenameBlur = () => {
        if (renameValue.trim() !== '') {
            onRename(imageKey, `public/images/${renameValue}`);
        }
    };

    return (
        <Flex
            direction="column"
            alignItems="center"
            border={'1px solid black'}
            borderRadius={'8px'}
            style={{
                position: 'relative',
                margin: '1rem',
                width: '400px',
                height: 'auto',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <View
                position="relative"
                style={{
                    width: '100%',
                    height: 'auto',
                }}
            >
                <img
                    src={url}
                    alt={imageKey}
                    style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}
                />
                {isHovered && (
                    <Flex
                        position="absolute"
                        bottom="0"
                        left="0"
                        right="0"
                        top="0"
                        backgroundColor="rgba(0, 0, 0, 0.5)"
                        color="white"
                        padding="small"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        style={{ zIndex: 1 }}
                        borderRadius={'8px'}
                    >
                        <Text fontSize="small" color={'white'}>
                            {caption}
                        </Text>
                    </Flex>
                )}
            </View>
            <Flex direction="row" alignItems="center" style={{ marginTop: '8px' }} marginBottom={'1rem'}>
                <Input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={handleRenameBlur}
                    style={{ width: '90%' }}
                    // marginBottom: '8px'
                />
                <Button
                    onClick={() => onDelete(imageKey)}
                    colorTheme="error"
                    // variation='primary'
                    style={{ width: '10%' }}
                >
                    <Text display={'flex'}>
                        <MdClose/>
                    </Text>
                </Button>
            </Flex>
        </Flex>
    );
};

export default ImageCard;
