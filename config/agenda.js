const Agenda = require('agenda');
const mongoose = require('mongoose');

const agenda = new Agenda({
    db: { address: 'mongodb+srv://leducdung02072004:g4H7FdXialfs66Cn@beebarber.ynx9m.mongodb.net/BeeBarber?retryWrites=true&w=majority&appName=BeeBarbere', collection: 'agendaJobs' },
    processEvery: '1 minute',
    useUnifiedTopology: true,
});

agenda.on('ready', () => {
    console.log('Agenda is ready to schedule jobs.');
});

agenda.on('error', (error) => {
    console.error('Agenda connection error:', error);
});

agenda.on('start', job => {
    console.log(`Job ${job.attrs.name} is starting at ${new Date()}`);
});

agenda.on('complete', job => {
    console.log(`Job ${job.attrs.name} completed at ${new Date()}`);
});

agenda.on('fail', (err, job) => {
    console.error(`Job ${job.attrs.name} failed at ${new Date()} with error:`, err);
});


module.exports = agenda;
