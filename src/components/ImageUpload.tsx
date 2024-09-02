import React from 'react';
import { Amplify } from 'aws-amplify';

import awsmobile from '@/aws-exports';

import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { Flex } from '@aws-amplify/ui-react';

Amplify.configure(awsmobile);

// taken straight from amplifyui docs
function FileUploadComponent(props: any) {

  const uploadingState = props.uploadingState;
  const setUploadingState = props.setUploadingState;

  return (
    <div>
      <Flex direction={'column'} justifyContent={'center'} alignItems={'center'}>
        <h1>Upload a File</h1>
      </Flex>
      <StorageManager
        acceptedFileTypes={['image/*']}
        maxFileCount={8}
        path="images/"
        accessLevel='guest'
        onUploadSuccess={(result) => {
          console.log('Upload succeeded:', result)
          setUploadingState(true);
          }
        }
        onUploadError={(error) => console.log('Upload failed:', error)}
      />
    </div>
  );
}

export default FileUploadComponent;
