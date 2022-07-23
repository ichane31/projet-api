export const valideFile = (type: string,fileMineType: string , fileSize : number) => {
    const MB = 10**6;
    
    let allowedMimeType= {image : [
        'image/png','image/jpg','image/jpeg'
    ] ,
    resume : ['application/msword',
            'application/vnd.oasis.opendocument.text',
            'text/plain'] ,

    rapport :['application/pdf','application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text'] ,
    
    presentation : ['application/vnd.ms-powerpoint',
       'application/vnd.openxmlformats-officedocument.presentationml.presentation'] ,
    
    video : ['video/x-msvideo','video/mpeg','video/ogg','video/mp4'] , 

    code : [  'application/zip',
            'application/vnd.rar',]};


    let maxSize = {image : MB,resume :20*MB,rapport : 60*MB ,
      presentation : 60*MB, video : 100*MB ,code : 500*MB};
   
    if (!(type in allowedMimeType) ) {
        return false;
    }

    let isValideMimetype = allowedMimeType[type].includes(fileMineType) 
    
    const isvalideSize = fileSize <= maxSize[type];

    let isValideFile = isValideMimetype && isvalideSize;

     return (isValideFile);

    

};
