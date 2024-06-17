import  {useCallback, useState} from 'react'
import {useDropzone,FileWithPath} from 'react-dropzone'


type FileUploaderProps ={
    fieldChange:(Files :File[]) =>void; //it's function that accepts files and return void
    mediaUrl:string
}

const FileUploader = ({fieldChange,mediaUrl}:FileUploaderProps) => {

    const [file, setFile] = useState<File[]>([])   //becuz we can  pass multiple files
    const [fileUrl, setFileUrl] = useState( mediaUrl||'')

    const onDrop = useCallback((acceptedFiles:FileWithPath[]) => {
        setFile(acceptedFiles)
        fieldChange(acceptedFiles)
        setFileUrl(URL.createObjectURL(acceptedFiles[0])) //index zero is to say the first file that we have 
      }, [file])

      const {getRootProps, getInputProps} = useDropzone(
        {onDrop,
        accept:{
            'image/*': ['.png','.jpeg','.jpg','.svg']
        }
        })

  return (
    <div 
    className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'
    {...getRootProps()}>
        <input 
        className='cursor-pointer'
        {...getInputProps()} 
        />
        {
        (fileUrl  )? (
             //here we show our uploaded file
             <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                  <img src={fileUrl  } alt="uploaded-file"  className='file_uploader-img'/>
                  <p className='file_uploader-label'>Click or drag photo to replace</p>
             </div>
        )
        :
        (
            <div className='file_uploader-box'>
                 <img src="/assets/icons/file-upload.svg" alt="add file"
                 width={96}
                 height={77}
                 />
                 <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photo here</h3>
                 <p className='text-light-4 small-regular mb-6'>SVG, PNG ,JPG</p>
                 <button className='shad-button_dark_4 rounded-2xl items-center'>
                    Select from computer
                 </button>
            </div>

        )
        
        }
  </div>
  )
}

export default FileUploader