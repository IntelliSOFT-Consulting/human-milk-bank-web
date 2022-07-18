import mailjet from 'node-mailjet'

let maijetClient = mailjet.connect(process.env['MAILJET_API_KEY'] as string, process.env['MAILJET_API_SECRET'] as string )



export async function sendEmail(data: {subject: string, to: {email:string, name: string}, from: {name:string, email: string}, body: string, html: string}){

    let response = await maijetClient.post("send", {'version':'v3.1'}).request({
        "Messages":[
            {
                "From":{
                    "Email": data.from.email,
                    "Name": data.from.name
                },
                "To":[{
                    "Email":data.to.email,
                    "Name":data.to.name
                }],
                "Subject": data.subject,
                "TextPart":data.body,
                "HTMLPart": data.html
            }
        ]
    })
    return response

}


export const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

export let sendPasswordResetEmail = async (user:any, resetLink:string) => {

    try {
        let response = await sendEmail({
            subject: "Reset Password: Neonatal Nutrition",
            to:{
                email:user.email as string,
                name: user.names as string
            },
            from:{
                name: "Neonatal Nutrition",
                email: "railamolo@gmail.com"
            },
            body: `Dear ${user.username},\n\n\nUse the link below to reset your password \n\n${resetLink}`,
            html: `
            <a href=${"https://human-milk-bank.netlify.app"}><button style="background-color: #37379b;border: none;padding: 15px 32px;color: white;width: 400px;font-weight: bold;">Neonatal Nutrition</button></a>
            
            <br/>
            <p>Dear ${user.username},<p>
            <h3>Click on the button or link below to reset your password<h3/>
            <a href=${resetLink}><button style="background-color:#37379b;border: none;padding: 15px 32px;">Click Here</button></a>
            <br/><br/>
            <a href=${resetLink}>Reset Link</a>
            <br/><br/>
            <a href=${"https://human-milk-bank.netlify.app"}>Neonatal Nutrition Website</a>
            `
        })
        return response
    } catch (error) {
        console.error(error)
        return error
    }
}


export let sendWelcomeEmail = async (user:any, resetLink:string) => {

    try {
        let response = await sendEmail({
            subject: "Welcome to Neonatal Nutrition",
            to:{
                email:user.email as string,
                name: user.names as string
            },
            from:{
                name: "Neonatal Nutrition",
                email: "railamolo@gmail.com"
            },
            body: `Dear ${user.username},\n\nAn account was created for you.\nUse the link below to get started \n\n${resetLink}`,
            html: `
            <a href=${"https://human-milk-bank.netlify.app"}><button style="background-color: #37379b;border: none;padding: 15px 32px;color: white;width: 400px;font-weight: bold;">Neonatal Nutrition</button></a>
            <br/>
            <p>Dear ${user.username},<p>
            <h3>Click on the button or link below to get started<h3/>
            <a href=${resetLink}><button style="background-color:#37379b;border: none;padding: 15px 32px;">Click Here</button></a>
            <br/><br/>
            <a href=${resetLink}>Reset Link</a>
            <br/><br/>
            <a href=${"https://human-milk-bank.netlify.app"}>Neonatal Nutrition Website</a>
            `
        })
        return response
    } catch (error) {
        console.error(error)
        return error
    }
}