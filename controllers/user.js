const db = require('../models');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const bcrypt = require('bcrypt');

exports.upload = function (req, res) {
    const { userid } = req.params;

    const form = new formidable.IncomingForm();
    const dir = path.join(__dirname + `/../public/uploads/${userid}`);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(__dirname + `/../public/uploads`);
        fs.mkdirSync(__dirname + `/../public/uploads/${userid}`);
    }

    //remove previous avatars
    fs.readdir(dir, (err, files) => {
        if (err) console.log(err);

        if (files) for (const file of files) {
            fs.unlink(path.join(dir, file), err => {
                if (err) console.log(err);
            });
        }
    });

    form.parse(req);

    form.on('fileBegin', function (name, file) {
        file.path = __dirname + `/../public/uploads/${userid}/${file.name}`;
    });

    form.on('file', function (name, file) {

        db.User.findById(userid).then(user => {
            user.avatar = `http://localhost:3001/uploads/${userid}/${file.name}`;

            user.save().then(() => {
                const userObj = {};

                for (key in user._doc) {
                    if (key !== 'password' && key !== 'entries' && key !== 'settings') userObj[key] = user._doc[key];
                }
                res.status(200).json(userObj);

            }).catch(err => console.log(err));
        });
    });
}

exports.editpassword = function (req, res) {
    const { userid } = req.params;
    const { current, newpass } = req.body;

    db.User.findById(userid).then(user => {
        if (!user) return res.status(401).json({ result: false });

        else if (bcrypt.compareSync(current, user.password)) {
            user.password = newpass;

            user.save().then(() => {
                if (req.session) req.session.reset();
                if (req.persistentSession) req.persistentSession.reset();

                req.session.user = user._id;
                res.status(200).json({ result: true });

            }).catch(err => console.log(err));
        }

        else res.status(401).json({ result: false });
    }).catch(err => console.log(err));
}

exports.edituserdata = function (req, res) {
    const { userid } = req.params;

    db.User.findById(userid).then(user => {
        if (req.body.email !== user.email) user.email = req.body.email;
        if (req.body.username !== user.username) user.username = req.body.username;
        user.settings = req.body.settings;

        user.save().then(() => {
            const userObj = {};

            for (key in user._doc) {
                if (key !== 'password' && key !== 'entries') userObj[key] = user._doc[key];
            }
            res.status(200).json(userObj);

        }).catch(err => console.log(err));

    }).catch(err => console.log(err));
}