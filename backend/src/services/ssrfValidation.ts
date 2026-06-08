import ipaddr from "ipaddr.js";
import dns from "dns";
import util from "util";

const dnsLookupAsync = util.promisify(dns.lookup);

const ALLOWED_PROTOCOLS = ["http:", "https:"];

export const isSSRFSafeUrl = async (urlString: string) : Promise<boolean> => {

    try{

        await validateUrlForSSRF(urlString);
        console.log("URL is safe. Proceeding to fetch...");
        return true;
    }catch(err: any) {
        console.log("SSRF validation failed: ", err.message);
        return false;
    }

}

const validateUrlForSSRF = async (userInputUrl: string) : Promise<void> => {

    let parsedUrl: URL;

    try{

        parsedUrl = new URL(userInputUrl);
        
    }catch(err) {
        throw new Error("Invalid URL format provided!!");
    }

    if(!ALLOWED_PROTOCOLS.includes(parsedUrl.protocol.toLowerCase())) {
        throw new Error(`Protocol ${parsedUrl.protocol} is not allowed!!`);
    }

    const hostname = parsedUrl.hostname;

    try{

        const lookupResult = await dnsLookupAsync(hostname);
        const resolvedIp = lookupResult.address;

        if(isInternalIp(resolvedIp)) {
            throw new Error(`Access denied: Resolved IP ${resolvedIp} is in a private range!!`);
        }

    }catch(err) {
        throw new Error(`Failed to resolve hostname or DNS is invalid: ${hostname}`);
    }

}

const isInternalIp = (ip: string): boolean => {

    try{

        const parsedIp = ipaddr.parse(ip);
        const range = parsedIp.range();

        return ['loopback', 'private', 'uniqueLocal', 'linkLocal'].includes(range);

    }catch(err) {
        return false;
    }

}