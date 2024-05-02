export class ForumController {


    async addPost(req, res) {
    
        try {
            
        } catch (error) {
            
        }
        
    
    }

    checkCatagory(catagory) {
        const eurovision = 'eurovision'
        const melo = 'melodifestivalen'
        if(catagory === eurovision || melo) {
            return true
        }
        return false
    }

    checkTheme(theme) {
        
        const general = 'general'
        const mucic = 'music'
        const artists = 'artists'


        if(theme === general || mucic || artists) {
            return true
        }
        return false
    }
    
        
    }