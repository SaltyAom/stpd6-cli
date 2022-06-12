#!/usr/bin/node
"use strict";
var b = g(require("ora")), c = function(a) {
    if (a && a.__esModule) return a;
    if (null === a || "object" != typeof a && "function" != typeof a) return {
        default: a
    };
    var b = h();
    if (b && b.has(a)) return b.get(a);
    var c = {}, f = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var d in a)if (Object.prototype.hasOwnProperty.call(a, d)) {
        var e = f ? Object.getOwnPropertyDescriptor(a, d) : null;
        e && (e.get || e.set) ? Object.defineProperty(c, d, e) : c[d] = a[d];
    }
    return c.default = a, b && b.set(a, c), c;
}(require("inquirer")), d = g(require("chalk")), e = require("readline"), f = g(require("isomorphic-unfetch"));
function g(a) {
    return a && a.__esModule ? a : {
        default: a
    };
}
function h() {
    if ("function" != typeof WeakMap) return null;
    var a = new WeakMap();
    return h = function() {
        return a;
    }, a;
}
const i = 'https://stpd6.saltyaom.com', j = (a)=>{
    console.clear(), console.log(a);
}, k = (a = '')=>{
    let b = e.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((c)=>b.question(a, (a)=>{
            c(a), b.close();
        }));
}, l = (a)=>new Promise((b)=>setTimeout(b, 1000 * a)), m = (a)=>f.default(`${i}/s/${a + 1}`), a = async ()=>{
    console.clear();
    let w = b.default('Connecting to Stupid server').start(), o = await f.default(`${i}/q`).catch((a)=>{
        w.stop(), j('Unable to connect to server, please try again'), process.exit(1);
    }).then((a)=>a.json());
    w.stop(), j('✅ Connected to Stupid server'), await l(1.5), console.clear();
    let e;
    for(; !e;){
        let { email: p  } = await c.default.prompt({
            type: 'input',
            name: 'email',
            message: "What's your email? (For ticket code recovery process on any accident)"
        });
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(p)) {
            e = p;
            break;
        }
        console.log('Please enter valid email'), await k(), console.clear();
    }
    for(console.clear(), console.log('Welcome to 1st Stupid Hackathon Thailand 1st Challenge'), console.log(''), console.log('The rule is simple.'), console.log(''), console.log("There's total of 10 questions."), console.log(''), console.log("These 10 questions require thinking-outside-the-box, it's improvised programming"), console.log(''), console.log("There's only 1 ticket per question."), console.log('Which means that, if someone have answered the question before you, you have to pick another question to answer.'), console.log(''), console.log("The question that is already answered will not appear in the selector list, so you don't have to worry about checking the status all the time."), console.log(''), console.log('Now, may the fortune favors the bold, good luck.'), await k(), console.clear();;){
        console.clear();
        let q = b.default('Syncing the status');
        q.start();
        let r = await f.default(`${i}/s`).then((a)=>a.json()).catch(()=>{
            q.stop(), console.log('Syncing the status failed :('), console.log('\nPlease check your internet connection and try again.'), process.exit(1);
        });
        q.stop(), console.clear(), r.every((a)=>a) && (console.log('Thanks you for participating, but unfortunately, all the tickets of this event is now reserved :('), console.log(''), console.log("But don't be sad, there're still more challenge thats easier than this one :)"), console.log('We hope to see you in the next challenge~'), await k(), process.exit(0));
        let { selected: g  } = await c.default.prompt({
            message: `${r.filter((a)=>!a).length} Questions left`,
            type: 'list',
            name: 'selected',
            choices: o.map((b, a)=>({
                    name: `${a + 1}) ${b.title}`,
                    value: a,
                    disabled: r[a]
                }))
        }), a = o[g], h = !0;
        for(; h;){
            console.clear();
            let { action: x  } = await c.default.prompt({
                message: `Question: ${d.default.cyan(a.title)}`,
                type: 'expand',
                name: 'action',
                pageSize: 12,
                choices: [
                    {
                        key: 'c',
                        name: `Canvas: ${i}${a.link}`,
                        disabled: !0
                    },
                    {
                        key: 'd',
                        name: `Detail: ${a.content}`,
                        disabled: !0
                    },
                    {
                        key: 't',
                        name: `Answers characters count: ${a.length} character${a.length > 1 ? 's' : ''}`,
                        disabled: !0
                    },
                    new c.Separator(),
                    {
                        key: 'a',
                        name: "Enter answer",
                        value: 'a'
                    },
                    {
                        key: 's',
                        name: "Check Status (see if anyone have completed this question)",
                        value: 's'
                    },
                    {
                        key: 'q',
                        name: "Change question",
                        value: 'q'
                    }
                ]
            });
            switch(x){
                case 'a':
                    let s = !0;
                    for(; s;){
                        console.clear();
                        let { answer: t  } = await c.default.prompt({
                            name: 'answer',
                            message: `What's your answer for "${a.title}" (type "exit" for exit)`
                        });
                        if ('exit' === t) {
                            s = !1;
                            break;
                        }
                        let n = await f.default(`${i}/a/${g + 1}`, {
                            method: 'PUT',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                from: e,
                                answer: t ?? ' '
                            })
                        });
                        200 === n.status ? (console.log(''), console.log(d.default.bold('🥳 Congratulation on your ticket reservation 🎉🎉🎉')), console.log(''), console.log(`${d.default.cyan.bold(await n.text())} is your ticket`), console.log("Please redeem this code at eventpop page"), console.log(''), console.log("We're pleasured to have an extraordinary talent on board."), console.log(`${d.default.cyan.bold('Welcome to Stupid Hackathon')}, and please enjoys the ride.`), console.log(''), console.log('For more information, feels free to contact staffs and organizers.'), await k(), process.exit(0)) : console.log(await n.text()), await k();
                    }
                    break;
                case 's':
                    let u = b.default('Checking Status');
                    u.start();
                    let v = await m(g);
                    u.stop(), await c.default.prompt({
                        name: 'status',
                        message: v ? 'No one have completed this question yet' : 'Someone have completed the question, returning to question selector...'
                    }), v || (h = !1);
                    break;
                case 'q':
                    h = !1;
            }
        }
    }
};
a();
