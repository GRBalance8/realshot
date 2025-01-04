// src/lib/api/uploadApi.ts
export async function uploadFile(file: File, onProgress?: (progress: number) => void) {
 const formData = new FormData()
 formData.append('file', file)
 
 const xhr = new XMLHttpRequest()
 
 return new Promise((resolve, reject) => {
   xhr.upload.addEventListener('progress', (event) => {
     if (event.lengthComputable && onProgress) {
       const progress = Math.round((event.loaded / event.total) * 100)
       onProgress(progress)
     }
   })

   xhr.addEventListener('load', () => {
     if (xhr.status >= 200 && xhr.status < 300) {
       try {
         const response = JSON.parse(xhr.responseText)
         resolve(response)
       } catch (error) {
         reject(new Error('Invalid response format'))
       }
     } else {
       reject(new Error('Upload failed'))
     }
   })

   xhr.addEventListener('error', () => reject(new Error('Upload failed')))
   xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))

   xhr.open('POST', '/api/studio/upload')
   xhr.send(formData)
 })
}

export async function deleteFile(fileId: string, isReference: boolean = false) {
 const queryParams = isReference ? '?type=reference' : ''
 const response = await fetch(`/api/studio/upload/${fileId}${queryParams}`, {
   method: 'DELETE'
 })
 if (!response.ok) {
   const error = await response.json()
   throw new Error(error.message || 'Delete failed')
 }
 return response.json()
}
