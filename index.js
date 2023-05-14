/*
    MCScan
    Copyright (C) 2023  Marcus Huber (xenorio) <dev@xenorio.xyz>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const MCQuery = require('mcquery')
const mongo = require('./mongo')
const ipterate = require('ipterate');

const config = require('./config')

let count = 0
let isReachable

start()

async function start() {
    isReachable = (await import('is-port-reachable')).default
    for(range of config.ranges){
        await ipterate.range(range).iterateAsync(ip => {
            return check(ip)
        })
    }
}

async function check(host) {
    return new Promise(async (resolve, reject) => {

        console.log(`[${count}] Checking ${host}`)

        let reachable = await isReachable(25565, {host: host})
        if(!reachable)return resolve()

        let query = new MCQuery(host, 25565)

        query.connect()
            .then(() => {

                query.full_stat((err, stat) => {
                    if (!err) {

                        mongo.queryOne('Servers', { 'from.address': stat.from.address })
                            .then(q => {
                                if (q) return
                                mongo.insert('Servers', stat)
                            })

                        count += 1
                        console.log(`[${count}] Found: ${stat.hostname} | ${stat.from.address}`)
                    }
                    resolve()
                })

            })
            .catch(err => {
                console.log(err.message)
                resolve()
            })
    })
}