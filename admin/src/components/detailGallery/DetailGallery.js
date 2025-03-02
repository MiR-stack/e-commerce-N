/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import DropzoneColumnPreview from 'components/dropzone/DropzoneColumnPreview';
import { getImageUrl } from 'utils';

const DetailGallery = ({ handleFile, images }) => {
  const filePaths = React.useMemo(() => {
    if (images) {
      const filteredImges = images.filter((image) => !image.is_main);

      return filteredImges.map((image) => ({ url: getImageUrl(image.image_data.url), name: image.image_data.name }));
    }
    return [];
  }, []);

  const [files, setFiles] = useState([]);

  const loadFile = ({ url, name }) => {
    return new Promise((resolve, reject) => {
      fetch(url).then((res) => {
        res.arrayBuffer().then((buf) => {
          return resolve(new File([buf], name, { type: 'image/jpeg' }));
        });
      });
    });
  };

  const loadFiles = useCallback(() => {
    const promises = filePaths.map((image) => {
      return loadFile(image);
    });
    Promise.all(promises).then((newFiles) => setFiles(newFiles));
  }, [filePaths]);

  useEffect(() => {
    loadFiles();
    return () => setFiles([]);
  }, [loadFiles]);

  const getUploadParams = () => ({ url: 'https://httpbin.org/post' });

  const onChangeStatus = ({ file }, status) => {
    if (status === 'done') {
      handleFile(file, 'done');
    }
    if (status === 'removed') {
      handleFile(file, 'removed');
    }
  };

  return (
    <Dropzone
      initialFiles={files}
      getUploadParams={getUploadParams}
      PreviewComponent={DropzoneColumnPreview}
      submitButtonContent={null}
      accept="image/*"
      submitButtonDisabled
      SubmitButtonComponent={null}
      inputWithFilesContent={null}
      onChangeStatus={onChangeStatus}
      classNames={{
        inputLabelWithFiles: defaultClassNames.inputLabel,
        dropzone: `${defaultClassNames.dropzone} row g-2 row-cols-2`,
      }}
      inputContent="Drop Files"
    />
  );
};

export default DetailGallery;
