const Promblem = require('../model/Promblem')
const User = require("../model/User")
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config();
const {signedCookies} = require('cookie-parser')


const login = asyncHandler(async (req,res) => {
  const{username ,password} = req.body ;

  if(!username || !password){
     return res.status(400).json({message : 'All fields is required'})
  }

  const foundUser = await User.findOne({username})

  if(!foundUser|| !foundUser) {
      return res.status(401).json({meassage : 'Unauthorized'})
  }

  const match = await bcrypt.compare(password ,foundUser.password)

  if(!match) return res.status(401).json({message : 'Unauthorized'});

  const accessToken = jwt.sign(
    {
      "UserInfo" : {
          "username" : foundUser.username ,

      }
  },
process.env.ACCESS_TOKEN_SECRET,
  {expiresIn : '25min'} )

  const refreshToken = jwt.sign(
    {
      "username" : foundUser.username ,
     },
   process.env.ACCESS_TOKEN_SECRET,
     {expiresIn : '25min'}
)

res.cookie('jwt',refreshToken , {
   httpOnly: true , //accesible only by webserver
   secure : true ,
   sameSite : 'None' , //cross-site cokkkie
   maxAge : 7 * 24 *60 * 60 * 1000
})



 res.json({accessToken})
})


//when token is expired
const refresh = (req,res) => {
const cookies = req.cookies

if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

const refreshToken = cookies.jwt

jwt.verify(
    refreshToken,
  process.env.ACCESS_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' })

        const foundUser = await User.findOne({ username: decoded.username }).exec()

        if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )

        res.json({ accessToken })
    })
)
}

//clear cookies
const logout = (req,res) => {
const cookies = req.cookies
if (!cookies?.jwt) return res.sendStatus(204) //No content
res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
res.json({ message: 'Cookie cleared' })
}

module.exports = {login ,refresh ,logout}