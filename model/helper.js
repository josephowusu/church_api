

const shuffle = (value) => {
    let a = value.toString().split(""), n = a.length
    for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var tmp = a[i]
        a[i] = a[j]
        a[j] = tmp
    }
    return a.join("")
}

const generateID = () => {
    return Number(shuffle(Date.now()))
}

const fullDateTime = (value) => {
    let date
    if (value) {
        date = new Date(value)
    } else {
        date = new Date()
    }

    let dd = date.getUTCDate()
    dd = dd < 10 ? '0'+dd : dd

    let mm = date.getUTCMonth()+1
    mm = mm < 10 ? '0'+mm : mm

    let yyyy = date.getUTCFullYear()

    return yyyy+'-'+mm+'-'+dd+' '+date.getUTCHours()+':'+date.getUTCMinutes()+':'+date.getUTCSeconds()
}

const fullDate = (value) => {
    let date
    if (value) {
        date = new Date(value)
    } else {
        date = new Date()
    }

    let dd = date.getUTCDate()
    dd = dd < 10 ? '0'+dd : dd

    let mm = date.getUTCMonth()+1
    mm = mm < 10 ? '0'+mm : mm

    let yyyy = date.getUTCFullYear()

    return yyyy+'-'+mm+'-'+dd
}

const getFormattedDate = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}


const mailTemp = (subject, message, name) => {
    let date = getFormattedDate()
    return (
        `<!DOCTYPE html>
        <html lang="en">
            <head>
                <link rel="stylesheet" href="email.css">
                <title>
                    Apostles Continuation Church International
                </title>
            </head>
            <style>
                @media only screen and (max-width: 600px) {
            .main {
                width: 320px !important;
            }
        
            .top-image {
                width: 100% !important;
            }
            .inside-footer {
                width: 320px !important;
            }
            table[class="contenttable"] { 
                width: 320px !important;
                text-align: left !important;
            }
            td[class="force-col"] {
                display: block !important;
            }
             td[class="rm-col"] {
                display: none !important;
            }
            .mt {
                margin-top: 15px !important;
            }
            *[class].width300 {width: 255px !important;}
            *[class].block {display:block !important;}
            *[class].blockcol {display:none !important;}
            .emailButton{
                width: 100% !important;
            }
        
            .emailButton a {
                display:block !important;
                font-size:18px !important;
            }
        
        }
            </style>
          <body link="#00a5b5" vlink="#00a5b5" alink="#00a5b5">
            <table class=" main contenttable" align="center" style="font-weight: normal;border-collapse: collapse;border: 0;margin-left: auto;margin-right: auto;padding: 0;font-family: Arial, sans-serif;color: #555559;background-color: white;font-size: 16px;line-height: 26px;width: 600px;">
                    <tr>
                        <td class="border" style="border-collapse: collapse;border: 1px solid #eeeff0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;">
                            
                        <table style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;">
                                <tr>
                                    <td colspan="4" valign="top" class="image-section" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;background-color: #fff;border-bottom: 4px solid #00a5b5;display: flex;align-items: center;padding-left: 20px;justify-content: space-between;">
                                        <div style="display: flex; width: 80%">
                                            <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D100064878422623&f=1&nofb=1&ipt=11f504b4d0b7b2bf3b86d7d8f70750c57df5f0ee13c7ae073e8ee4008871736a&ipo=images" width="50px" alt="ACCI logo" style="padding-right: 5px;"/>
                                            <h1>ACCI</h1>
                                        </div>
                                        <div style="margin-top: 20px">
                                            ${date} <br>
                                        </div>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td valign="top" class="side title" style="border-collapse: collapse;border: 0;margin: 0;padding: 20px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;vertical-align: top;background-color: white;border-top: none;">
                                        <table style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;">
                                            <tr>
                                                <td class="head-title" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 28px;line-height: 34px;font-weight: bold; text-align: center;">
                                                    <div class="mktEditable" id="main_title">
                                                        ${subject}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="top-padding" style="border-collapse: collapse;border: 0;margin: 0;padding: 5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;"></td>
                                            </tr>
                                            <tr>
                                                <td class="grey-block" style="border-collapse: collapse;border: 0;margin: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;background-color: #fff; text-align:center;">
                                                
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="top-padding" style="border-collapse: collapse;border: 0;margin: 0;padding: 15px 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 21px;">
                                                    <hr size="1" color="#eeeff0">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;">
                                                <div class="mktEditable" id="main_text">
                                                    Hello ${name},<br><br>
                                                   ${message}
                                              </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;">
                                                 &nbsp;<br>
                                                </td>
                                            </tr>
            
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:20px; font-family: Arial, sans-serif; -webkit-text-size-adjust: none;" align="center">
                                        <table>
                                            <tr>
                                                <td align="center" style="font-family: Arial, sans-serif; -webkit-text-size-adjust: none; font-size: 16px;">
                                                    <br/><span style="font-size:10px; font-family: Arial, sans-serif; -webkit-text-size-adjust: none;" > This is an automated message, so please do not reply.
        
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 24px; padding: 20px;">
                                    <div class="mktEditable" id="cta_try">
                    
                                    </div>
                                    </td>
                                </tr>											
                                <tr>
                                    <td valign="top" align="center" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;">
                                        <table style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;">
                                            <tr>
                                                <td align="center" valign="middle" class="social" style="border-collapse: collapse;border: 0;margin: 0;padding: 10px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;text-align: center;">
                                                    <table style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;">
                                                        <tr>
                                                <td style="border-collapse: collapse;border: 0;margin: 0;padding: 5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;"><a href="https://twitter.com"><img src="https://info.tenable.com/rs/tenable/images/twitter-teal.png"></a></td>
                                                <td style="border-collapse: collapse;border: 0;margin: 0;padding: 5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;"><a href="https://www.facebook.com/accidkw/"><img src="https://info.tenable.com/rs/tenable/images/facebook-teal.png"></a></td>
                                                <td style="border-collapse: collapse;border: 0;margin: 0;padding: 5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;"><a href="https://www.youtube.com"><img src="https://info.tenable.com/rs/tenable/images/youtube-teal.png"></a></td>
                                                <td style="border-collapse: collapse;border: 0;margin: 0;padding: 5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;"><a href="https://www.linkedin.com"><img src="https://info.tenable.com/rs/tenable/images/linkedin-teal.png"></a></td>
            
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr bgcolor="#fff" style="border-top: 4px solid #00a5b5;">
                                    <td valign="top" class="footer" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;background: #fff;text-align: center;">
                                        <table style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;">
                                            <tr>
                                                <td class="inside-footer" align="center" valign="middle" style="border-collapse: collapse;border: 0;margin: 0;padding: 20px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 12px;line-height: 16px;vertical-align: middle;text-align: center;width: 580px;">
            <div id="address" class="mktEditable">
                                                    <b>Apostles Continuation Church</b><br>
                                                     Ghana, Bono Region, Sunyani<br>
                                        <a style="color: #00a5b5;" href="tel:+233261256717">Contact Us</a>
            </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
              </body>
        </html>`
    )
}

module.exports = {
    generateID,
    fullDateTime,
    fullDate,
    mailTemp,
    getFormattedDate
}