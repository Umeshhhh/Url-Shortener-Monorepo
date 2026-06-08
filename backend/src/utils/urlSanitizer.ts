

export const sanitizeUrl = (urlString: string, customBlocklist?: string[]) : string | null => {

    try{

        const url = new URL(urlString);

        const defaultBlocklist = [
            'utm_source',
            'utm_medium',
            'utm_campaign',
            'utm_term',
            'utm_content',
            'fbclid',      // Facebook Click ID
            'gclid',        // Google Click ID
            'dclid',        // Google Display Network Click ID
            'msclkid',      // Microsoft Advertising Click ID
            'twclid',       // Twitter Click ID
            'ttclid',       // TikTok Click ID
            '_hsenc',       // HubSpot
            '_hsmi',        // HubSpot
            'mc_cid',       // Mailchimp
            'mc_eid',       // Mailchimp
            'igshid'        // Instagram Share ID
        ];

        const blocklist = customBlocklist ? [...defaultBlocklist, ...customBlocklist] : defaultBlocklist;

        const params = url.searchParams;
        const keysToDelete: string[] = [];

        for(const key of params.keys()) {
            if(blocklist.includes(key)) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => params.delete(key));

        return url.toString().trim();

    }catch(err) {

        console.log("Invalid URL provided: ", err);
        return null;

    }

}