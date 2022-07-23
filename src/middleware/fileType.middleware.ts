export const valideFile = (type: string,fileMineType: string , fileSize : number) => {
    let allowedMimeType= [];
    let maxSize = 0;
    if(type == "image") {
        allowedMimeType = ['image/png','image/jpg','image/jpeg',];
        maxSize = 1000000; // 1 Mo
    }

    else if (type == "rapport") {
        allowedMimeType = [
            'application/pdf','application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.text'
            
          ];
         maxSize = 60000000; //60 Mo
    }

    else if(type == "resume") {
        allowedMimeType = [
            'application/msword',
            'application/vnd.oasis.opendocument.text',
            'text/plain',
          ];
          maxSize = 20000000; //20 Mo
    }
    else if (type == "presentation") {
        allowedMimeType = ['application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
        maxSize = 60000000; //60 Mo
        
    }
    else if(type == "video") {
        allowedMimeType  = [
            'video/x-msvideo','video/mpeg','video/ogg','video/mp4'
            
          ];
          maxSize = 100000000 ;//100 Mo
    }

    else if(type == "code"){
        allowedMimeType = [
            'application/zip',
            'application/vnd.rar',
            
          ];

          maxSize = 500000000; //500 Mo

    }
    

    const isValideMimetype =  allowedMimeType.includes(fileMineType);
    const isvalideSize = fileSize <= maxSize;

    const isValideFile = isValideMimetype && isvalideSize;

    return (isValideFile);

    

};