

module.exports = {
    isImage: (fileExtension) => {
        switch (fileExtension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'svg':
                return true
            }
            return false
    },
    isDocument: (fileExtension) => {
        switch (fileExtension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'svg':
            case 'pdf':
                return true
            }
            return false
    }
}