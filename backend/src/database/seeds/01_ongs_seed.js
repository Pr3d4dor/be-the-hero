exports.seed = function (knex) {
    return knex('ongs')
        .del()
        .then(function () {
            return knex('ongs').insert([
                {
                    id: 'a521001b',
                    name: 'Example ONG',
                    email: 'ong@ong.com',
                    whatsapp: '+5542000000000',
                    city: 'Guarapuava',
                    uf: 'PR',
                },
                {
                    id: 'bcccccc',
                    name: 'Example ONG 2',
                    email: 'ong2@ong.com',
                    whatsapp: '+5542000000000',
                    city: 'Guarapuava',
                    uf: 'PR',
                },
            ]);
        });
};
