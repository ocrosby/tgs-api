'use strict';

/*
  @swagger
   components:
     schemas:
       Club:
         type: object
         required:
           - title
           - author
           - finished
         properties:
           orgID:
             type: integer
             description: The id of the organization.
           clubID:
             type: integer
             description: The id of the club.
           name:
             type: string
             description: The name of the club.
           city:
             type: string
             description: The city the club resides in.
           clublogo:
             type: string
             description: The URL of the club logo.
           location:
             type: string
             description: The location of the club.
           statecode:
             type: string
             description: The state the club resides in.
           orgseasonID:
             type: integer
             description: The season the club is in.
           OverallRecord:
             type: string
             description: The overall record of the club.
           TotalWin:
             type: string
             description: Total wins of the club.
           TotalLoss:
             type: string
             description: Total losses of the club.
           ConferenceName:
             type: string
             description: The conference the competes in.
           Total:
             type: integer
             description: Unknown
           TotalCommitted:
             type: integer
             description: Unknown
           TotalUncommitted:
             type: integer
             description: Unknown
         example:
            orgID: 1
            clubID: 2
            name: "TotalCool FC"
            city: Bedrock
            clublogo: https://some/thing/cool.jpg
            location: ""
            statecode: "CA"
            orgseasonID: 3
            OverallRecord: ""
            TotalWin: ""
            TotalLoss: ""
            ConferenceName: ""
            Total: 4
            TotalCommitted: 5
            TotalUncommitted: 6

*/

const axios = require('axios').default;

var express = require('express');
var router = express.Router();

const urls = {
    conferences: 'https://www.eliteclubsnationalleague.com/member-clubs/confernces/',
    memberClubs: 'https://www.eliteclubsnationalleague.com/member-clubs/?view=clublist',
    memberClubsApi: 'https://api.totalglobalsports.com/json/?token=Q0jcEIroy7Y=|9&ds=GetOrgClublistBySeasonIDPagingSP&oid=9&orgsid=12'
};

/* GET clubs listing. */
router.get('/', async function (_req, res, _next) {
    const config = {
        timeout: 0,
        withCredentials: false,
        responseType: 'json',
        responseEncoding: 'utf8'
    };

    try {
        const response = await axios.get(urls.memberClubsApi, config);

        if (response.status === 200) {
            res.status(200).json(response.data);
        } else {
            res.status(response.status).json({
                message: 'Remote Server Error'
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;