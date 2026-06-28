import QRCode  from "qrcode"

export const qrCodeGenerator = async (url: string) => {

    try {
        return await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            errorCorrectionLevel: "M"
        });

    }catch(err) {
        console.log(err);
        throw new Error("Error while generating qr-code for the url!");
    }

}