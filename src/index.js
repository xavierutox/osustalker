import "./styles.css"
import axios from "axios"

let api = 'https://osu.ppy.sh/api/'
let userBest = 'get_user_best?'
let userData = "get_user?"
let mapData = "get_beatmaps?"
let key = 'k=[apikey]'
let imageLink = "https://a.ppy.sh/"
let beatmapBG1 = "https://assets.ppy.sh/beatmaps/"
let beatmapBG2 = "/covers/cover@2x.jpg"
let countryFlag = "https://osu.ppy.sh/images/flags/"
let mapScores= 'get_scores?'
let mapAudio = "https://b.ppy.sh/preview/"

console.log("Run test")

if (module.hot) {
    module.hot.accept()
}

var mapIDs = []
var userIDs = []

function queryBest(_,inputID) {
    if (inputID == undefined) {
        inputID = userName.value
    }
    var bestUrl = api + userBest + key + '&u=' + inputID + '&limit=' + scoreLimit.value + '&m=' + modeSelect.value
    var userUrl = api + userData + key + '&u=' + inputID + '&m=' + modeSelect.value
    axios.get(bestUrl).then((bestRes) => {
        axios.get(userUrl).then((userRes) => {
            console.log(bestRes.data)
            console.log(userRes.data[0])
            var bestInfo = bestRes.data
            var userInfo = userRes.data[0]
            userdataName.textContent = userInfo['username']
            userdataImage.src = imageLink + userInfo['user_id'] + '?.jpeg'
            userdataFlag.src = countryFlag + userInfo['country'] + '.png'
            userdataRankedScore.textContent = parseInt(userInfo['ranked_score'], 10).toLocaleString()
            userdataAccuracy.textContent = parseFloat(userInfo['accuracy']).toFixed(2) + '%'
            userdataPlayCount.textContent = userInfo['playcount']
            userdataRanking.textContent = 'Global #' + parseInt(userInfo['pp_rank'], 10).toLocaleString() + '  (Local #' + parseInt(userInfo['pp_country_rank'], 10).toLocaleString() + ')'
            userdataPP.textContent = parseInt(userInfo['pp_raw'], 10).toLocaleString() + 'pp'

            userdataDisplay.style.display = "block"

            scoresContainer.innerHTML = ''
            mapIDs = []

            setTimeout(function() {
                for (let i = 0; i < scoreLimit.value; i++) {
                    var acc = 0
                    setTimeout(function(){
                        acc = getAcc(bestInfo[i])
                    }, i * 150)
                    
                    setTimeout(function() {
                        queryMapName(bestInfo[i]['beatmap_id'], parseFloat(bestInfo[i]['pp'],10) * Math.pow(0.95,i), bestInfo[i]['rank'], acc)
                    }, i * 150)
                }
                setTimeout(function() {
                    console.log("mapIDs " + mapIDs)
                    mapIDs.forEach(id => {
                        document.getElementById(id).addEventListener('click', function(){queryMapFromUser(id, modeSelect.value)})
                        console.log("Added #" + id)
                    })      
                }, 400 * scoreLimit.value)
            }, 1000 + 17 * scoreLimit.value);
        }).catch((error) => {
            console.log(error)
        })
    }).catch((error) => {
        console.log(error)
    })
}

function getAcc(data) {
    let n50 = parseInt(data['count50'], 10)
    let n100 = parseInt(data['count100'], 10)
    let n300 = parseInt(data['count300'], 10)
    let miss = parseInt(data['countmiss'], 10)
    let katu = parseInt(data['countkatu'], 10)
    let geki = parseInt(data['countgeki'], 10)
    switch (modeSelect.value) {
        default:  //osu!
            return ((50 * n50 + 100 * (n100) + 300 * (n300))/(300 * (miss + n50 + n100 + n300)) * 100).toFixed(2)
        case "0":  // osu!
            return ((50 * n50 + 100 * (n100) + 300 * (n300))/(300 * (miss + n50 + n100 + n300)) * 100).toFixed(2)
        case "1":  // osu!taiko
            return ((0.5 * (n100) + (n300))/(miss + (n100) + (n300)) * 100).toFixed(2)
        case "2": // osu!catch
            return ((n50 + n300 + n100)/(n50 + n300 + n100 + katu + miss) * 100).toFixed(2)
        case "3" : //osu!mania
            return ((50 * n50 + 100 * n100 + 200 * katu + 300 * (n300 + geki))/(300 * (miss + n50 + n100 + n300 + katu + geki)) * 100).toFixed(2)
    }
}

function queryMapName(id, weight, rank, acc){
    var mapUrl = api + mapData + key  + '&b='+ id
    axios.get(mapUrl).then((mapRes) => {
        scoresContainer.innerHTML += '<table class="score"><tr><td><button class="borderlessButton" style="font-weight:bold; font-size:100%" id="' + id + '">' + mapRes.data[0]['title'] + '</button><p style="font-size: 80%; color:#ffa500; padding-left:0.6em">' + mapRes.data[0]['version'] + '</p></td><td align="right"><span><b>' + acc + '%&nbsp</span><p style="text-align:"right"">' + Math.round(weight) + 'pp&nbsp</p></b></td></tr></table><div class=hline></div>'
        mapIDs.push(id)
    }).catch((error) => {
        console.log(error)
    })
}

function queryMapFromUser(id, mode) {
    console.log("queryMapFromUser(" + id + ")")
    byMap()
    queryMap(undefined, id, mode)
    mapIDs=[]
}
function queryUserFromMap(id){
    console.log("queryUserFromMap(" + id + ")")
    byUser()
    queryBest(undefined, id)
    userIDs=[]
}


function byUser() {
    searchbyUser.style.display = "block"
    searchbyMap.style.display = "none"
}

function byMap() {
    searchbyUser.style.display = "none"
    searchbyMap.style.display = "block"
}

function queryMap(_, inputID, mode) {
    if (inputID == undefined) {
        inputID = mapID.value
    }
    if(mode == undefined){
        mode=mapmodeSelect
    }
    console.log("inputID " + inputID)
    console.log("mapID.value " + mapID.value)
    var mapUrl = api + mapScores + key + '&b=' + inputID + '&limit=' + mapscoreLimit.value + '&m=' + mode
    var dataUrl = api + mapData + key + '&b=' + inputID
    axios.get(mapUrl).then((mapRes) => {
        axios.get(dataUrl).then((dataRes) => {
            console.log(mapRes.data)
            console.log(dataRes.data[0])
            var mapInfo = mapRes.data
            var dataInfo = dataRes.data[0]
            userIDs=[]

            mapdataImage.src = beatmapBG1 + dataInfo['beatmapset_id'] + beatmapBG2
            mapdataName.textContent = dataInfo['title']
            mapdataArtist.textContent = dataInfo['artist']
            mapdataDiff.textContent = dataInfo['version'] + ' '
            if (mapmodeSelect.value == 0) {
                mapdataDiff.textContent += '(osu!)'
            } else if (mapmodeSelect.value == 1) {
                mapdataDiff.textContent += '(osu!taiko)'
            } else if (mapmodeSelect.value == 2) {
                mapdataDiff.textContent += '(osu!catch)'
            } else if (mapmodeSelect.value == 3) {
                mapdataDiff.textContent += '(osu!mania)'
            }
            mapdataCreator.textContent = dataInfo['creator']
            mapdataAudio.src = mapAudio + dataInfo['beatmapset_id'] + '.mp3'
            mapdataLength.textContent = Math.floor(dataInfo['total_length'] / 60) + ':' + dataInfo['total_length'] % 60
            mapdataBpm.textContent = dataInfo['bpm']
            mapdataSr.textContent = parseFloat(dataInfo['difficultyrating']).toFixed(2)

            mapdataDisplay.style.display = "block"

            mapScoreContainer.innerHTML = '<table class="score" style="background-color:#606060"><tr><td align="center" class="mapScore" style="padding-left:2em">&nbsp<b>Position</b></td><td align="center" class="mapScore" style="padding-left:6em"><b>Rank</b></td><td align="center" class="mapScore_header" style="padding-right:1em"><b>Score</b></td><td align="center" class="mapScore" style="padding-right:9em"><b>Accuracy</b></td><td align="center" class="mapScore" style="padding-right:9em"><b>Player</b></td><td align="center" class="mapScore" style="padding-right:4em"><b>Max Combo</b></td><td align="center" class="mapScore" style="padding-right:2em"><b>PP</b></td></tr></table>'
            for (let i = 0; i < mapscoreLimit.value; i++) {
                setTimeout(function(){
                    mapScoreContainer.innerHTML += '<table class="score"><tr><td align="center" class="mapScore">&nbsp#' + (i + 1) + '</td><td align="center" class="mapScore">' + mapInfo[i]['rank'] +'</td><td align="center" class="mapScore">' + parseInt(mapInfo[i]['score']).toLocaleString() + '</td><td align="center" class="mapScore">' + getAcc(mapInfo[i]) + '%' + '</td><td align="center" class="mapScore">'+'<button class="borderlessButton" style="font-weight:bold; font-size:100%" id="' + mapInfo[i]['user_id'] + '">' + mapInfo[i]['username'] + '</a></td><td align="center" class="mapScore">' + mapInfo[i]['maxcombo'] + '</td><td align="center" class="mapScore">' + Math.round(mapInfo[i]['pp']) + '</td></tr></table><div class=hline></div>'
                    userIDs.push(mapInfo[i]['user_id'])
                }, i * 300)
            }
            setTimeout(function() {
                console.log("userIDs " + userIDs)
                userIDs.forEach(id => {
                    document.getElementById(id).addEventListener('click', function(){queryUserFromMap(id)})
                    console.log("Added #" + id)
                })      
            }, 400 * scoreLimit.value)

        }).catch((error) => {
            console.log(error)
        })
    }).catch((error) => {
        console.log(error)
    })
}

function returnToTop() {
    byUser()
    userdataDisplay.style.display = "none"
}

let userName = document.querySelector("#username")
let scoreLimit = document.querySelector("#scorelimit")
let modeSelect = document.querySelector("#modeselect")
let submitButton = document.querySelector("#submit")

let mapID = document.querySelector("#mapid")
let mapscoreLimit = document.querySelector("#mapscorelimit")
let mapmodeSelect = document.querySelector("#mapmodeselect")
let mapsubmitButton = document.querySelector("#mapsubmit")

let searchbyUser = document.querySelector("#searchbyuser")
let searchbyMap = document.querySelector("#searchbymap")
let userdataDisplay = document.querySelector("#userdata_display")
let mapdataDisplay = document.querySelector("#mapdata_display")

let byuserButton = document.querySelector("#byuserbutton")
let bymapButton = document.querySelector("#bymapbutton")
let logoButton = document.querySelector("#logobutton")

let userdataImage = document.querySelector("#userdata_image")
let userdataName = document.querySelector("#userdata_name")
let userdataFlag = document.querySelector("#userdata_flag")
let userdataRankedScore = document.querySelector("#userdata_rankedscore")
let userdataAccuracy = document.querySelector("#userdata_accuracy")
let userdataPlayCount = document.querySelector("#userdata_playcount")
let userdataRanking = document.querySelector("#userdata_ranking")
let userdataPP = document.querySelector("#userdata_pp")

let mapdataImage = document.querySelector("#mapdata_image")
let mapdataName = document.querySelector("#mapdata_name")
let mapdataArtist = document.querySelector("#mapdata_artist")
let mapdataDiff = document.querySelector("#mapdata_diff")
let mapdataCreator = document.querySelector("#mapdata_creator")
let mapdataAudio = document.querySelector("#mapdata_audio audio")
let mapdataLength = document.querySelector("#mapdata_length")
let mapdataBpm = document.querySelector("#mapdata_bpm")
let mapdataSr = document.querySelector("#mapdata_sr")

let mapScoreContainer = document.querySelector("#mapscore_container")
let scoresContainer = document.querySelector("#scores_container")

submitButton.addEventListener('click', queryBest)
byuserButton.addEventListener('click', byUser)
bymapButton.addEventListener('click', byMap)
mapsubmitButton.addEventListener('click', queryMap)
logoButton.addEventListener('click', returnToTop)
