exports.seed = function (knex) {
    return knex('incidents')
        .del()
        .then(function () {
            const incidents = [];

            for (let i = 0; i < 20; i++) {
                incidents.push({
                    title: `Example Incident ${i}`,
                    description: `Description ${i}`,
                    value: 100,
                    ong_id: 'a521001b',
                });
            }

            for (let i = 0; i < 5; i++) {
                incidents.push({
                    title: `Incident ${i}`,
                    description: `${i} Test`,
                    value: 200,
                    ong_id: 'bcccccc',
                });
            }

            return knex('incidents').insert(incidents);
        });
};
