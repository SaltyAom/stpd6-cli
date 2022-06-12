#!/usr/bin/node
import ora from 'ora'
import i, { Separator } from 'inquirer'
import c from 'chalk'
import ca from 'chalk-animation'
import { createInterface } from 'readline'

import fetch from 'isomorphic-unfetch'
import { Question } from 'types'

const server = 'https://stpd6.saltyaom.com'

const clearWith = (text: string) => {
    console.clear()
    console.log(text)
}

const waitForEnter = (query = '') => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    })

    return new Promise((resolve) =>
        rl.question(query, (ans) => {
            resolve(ans)
            rl.close()
        })
    )
}

const delay = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time * 1000))

const getStatus = (question: number) => fetch(`${server}/s/${question + 1}`)

const main = async () => {
    console.clear()

    const spinner = ora('Connecting to Stupid server').start()
    const questions: Question[] = await fetch(`${server}/q`)
        .catch((err) => {
            spinner.stop()
            clearWith('Unable to connect to server, please try again')

            process.exit(1)
        })
        .then((r) => r.json())

    spinner.stop()
    clearWith('✅ Connected to Stupid server')

    await delay(1.5)
    console.clear()

    let email

    while (!email) {
        let { email: proposedEmail } = await i.prompt({
            type: 'input',
            name: 'email',
            message:
                "What's your email? (For ticket code recovery process on any accident)"
        })

        if (
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
                proposedEmail
            )
        ) {
            email = proposedEmail
            break
        } else {
            console.log('Please enter valid email')
            await waitForEnter()
            console.clear()
        }
    }

    console.clear()

    console.log('Welcome to 1st Stupid Hackathon Thailand 1st Challenge')
    console.log('')
    console.log('The rule is simple.')
    console.log('')
    console.log("There's total of 10 questions.")
    console.log('')
    console.log(
        "These 10 questions require thinking-outside-the-box, it's improvised programming"
    )
    console.log('')
    console.log("There's only 1 ticket per question.")
    console.log(
        'Which means that, if someone have answered the question before you, you have to pick another question to answer.'
    )
    console.log('')
    console.log(
        "The question that is already answered will not appear in the selector list, so you don't have to worry about checking the status all the time."
    )
    console.log('')
    console.log('Now, may the fortune favors the bold, good luck.')

    await waitForEnter()
    console.clear()

    while (true) {
        console.clear()

        const syncingStatus = ora('Syncing the status')
        syncingStatus.start()
        const status: boolean[] = await fetch(`${server}/s`)
            .then((r) => r.json())
            .catch(() => {
                syncingStatus.stop()

                console.log('Syncing the status failed :(')
                console.log(
                    '\nPlease check your internet connection and try again.'
                )

                process.exit(1)
            })
        syncingStatus.stop()

        console.clear()

        if (status.every((q) => q)) {
            console.log(
                'Thanks you for participating, but unfortunately, all the tickets of this event is now reserved :('
            )
            console.log('')
            console.log(
                "But don't be sad, there're still more challenge thats easier than this one :)"
            )
            console.log('We hope to see you in the next challenge~')

            await waitForEnter()
            process.exit(0)
        }

        const { selected } = await i.prompt({
            message: `${status.filter((s) => !s).length} Questions left`,
            type: 'list',
            name: 'selected',
            choices: questions.map((question, index) => ({
                name: `${index + 1}) ${question.title}`,
                value: index,
                disabled: status[index]
            }))
        })

        const question = questions[selected]
        let viewingQuestion = true

        while (viewingQuestion) {
            console.clear()

            const { action } = await i.prompt({
                message: `Question: ${c.cyan(question.title)}`,
                type: 'expand',
                name: 'action',
                pageSize: 12,
                choices: [
                    {
                        key: 'c',
                        name: `Canvas: ${server}${question.link}`,
                        disabled: true
                    },
                    {
                        key: 'd',
                        name: `Detail: ${question.content}`,
                        disabled: true
                    },
                    {
                        key: 't',
                        name: `Answers characters count: ${
                            question.length
                        } character${question.length > 1 ? 's' : ''}`,
                        disabled: true
                    },
                    new Separator(),
                    {
                        key: 'a',
                        name: `Enter answer`,
                        value: 'a'
                    },
                    {
                        key: 's',
                        name: `Check Status (see if anyone have completed this question)`,
                        value: 's'
                    },
                    {
                        key: 'q',
                        name: `Change question`,
                        value: 'q'
                    }
                ]
            })

            switch (action) {
                case 'a':
                    let answering = true
                    while (answering) {
                        console.clear()

                        const { answer } = await i.prompt({
                            name: 'answer',
                            message: `What's your answer for "${question.title}" (type "exit" for exit)`
                        })

                        if (answer === 'exit') {
                            answering = false
                            break
                        }

                        const res = await fetch(`${server}/a/${selected + 1}`, {
                            method: 'PUT',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                from: email,
                                answer: answer ?? ' '
                            })
                        })

                        if (res.status === 200) {
                            console.log('')
                            console.log(
                                c.bold(
                                    '🥳 Congratulation on your ticket reservation 🎉🎉🎉'
                                )
                            )
                            console.log('')
                            console.log(
                                `${c.cyan.bold(
                                    await res.text()
                                )} is your ticket`
                            )
                            console.log(
                                `Please redeem this code at eventpop page`
                            )
                            console.log('')
                            console.log(
                                "We're pleasured to have an extraordinary talent on board."
                            )
                            console.log(
                                `${c.cyan.bold(
                                    'Welcome to Stupid Hackathon'
                                )}, and please enjoys the ride.`
                            )
                            console.log('')
                            console.log(
                                'For more information, feels free to contact staffs and organizers.'
                            )

                            await waitForEnter()

                            process.exit(0)
                        } else console.log(await res.text())

                        await waitForEnter()
                    }

                    break

                case 's':
                    const checkingStatus = ora('Checking Status')
                    checkingStatus.start()
                    const available = await getStatus(selected)
                    checkingStatus.stop()

                    await i.prompt({
                        name: 'status',
                        message: available
                            ? 'No one have completed this question yet'
                            : 'Someone have completed the question, returning to question selector...'
                    })

                    if (!available) viewingQuestion = false

                    break

                case 'q':
                    viewingQuestion = false
                    break

                default:
                    break
            }
        }
    }
}

main()
