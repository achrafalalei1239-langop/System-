module.exports = {
    name: 'اوامر',
    description: 'جميع الأوامر العربية في ملف واحد.',
    async execute(message, args, client) {
        if (args.length === 0) {
            const commandsList = [
                'سلام', 'وقت', 'مساعدة', 'معلومات', 'نكتة', 'طرد', 'حظر', 'اقتراح', 'لعب', 'رابط', 'ترحيب',
                'وداع', 'حالة', 'سيرفر', 'صورة', 'صورة_عضو', 'عدد', 'منشن', 'من_انا', 'بان', 'كيك', 'تاريخ',
                'سعر', 'مزحة', 'معلومة', 'تقييم', 'تصويت', 'اختبار', 'تحدي', 'ترجمة', 'عكس', 'تخمين', 'قرعة',
                'حكمة', 'دعاء', 'آية', 'سؤال', 'جواب', 'كود', 'لون', 'حظ', 'سؤال_عام', 'شخصية', 'اسم', 'ماذا_لو',
                'صورة_عشوائية', 'توقيت', 'كم_الساعة', 'فتح', 'اغلاق', 'ملاحظة', 'تذكير', 'استفسار', 'ابراج', 'موافق'
            ];
            return message.channel.send(
                `الأوامر المتاحة:\n` + commandsList.map(e => `**!${e}**`).join(' | ')
            );
        }

        const command = args[0].toLowerCase();
        switch (command) {
            case 'سلام':
                return message.channel.send('وعليكم السلام ورحمة الله!');
            case 'وقت':
            case 'توقيت':
            case 'كم_الساعة':
                return message.channel.send(`الوقت الحالي: ${new Date().toLocaleString('ar-EG')}`);
            case 'معلومات':
                return message.channel.send(`اسمي ${client.user.username}، أعمل على أكثر من 50 أمر باللغة العربية!`);
            case 'مساعدة':
                return message.channel.send('استخدم !اوامر لعرض جميع الأوامر المتاحة.');
            case 'نكتة':
            case 'مزحة':
                {
                    const jokes = [
                        'مرة واحد ذهب للطبيب قال له: كل ما أشرب شاي أحس بألم في عيني، قال له: جرب شيل الملعقة يا عبقري!',
                        'مرة واحد ذهب إلى البحر غرق، قال له البحر: ليش ما تعلمت السباحة؟ قال له: كنت مشغول بالغرق!',
                        'مرة واحد ذهب للبقالة قال للبقال: عندك عيش؟ قال له: لا، عندي رز غاضب!'
                    ];
                    const joke = jokes[Math.floor(Math.random() * jokes.length)];
                    return message.channel.send(joke);
                }
            case 'حكمة':
                {
                    const hikma = [
                        'العقل زينة.',
                        'من جد وجد ومن زرع حصد.',
                        'الصبر مفتاح الفرج.',
                        'خير الكلام ما قل ودل.'
                    ];
                    return message.channel.send(hikma[Math.floor(Math.random() * hikma.length)]);
                }
            case 'دعاء':
                {
                    const doa = [
                        'اللهم اغفر لي ولوالدي.',
                        'اللهم ارزقنا الجنة.',
                        'اللهم اشفِ مرضانا ومرضى المسلمين.'
                    ];
                    return message.channel.send(doa[Math.floor(Math.random() * doa.length)]);
                }
            case 'آية':
                {
                    const ayat = [
                        '﴿وَقُلْ رَبِّ زِدْنِي عِلْمًا﴾',
                        '﴿إِنَّ مَعَ الْعُسْرِ يُسْرًا﴾',
                        '﴿اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ﴾'
                    ];
                    return message.channel.send(ayat[Math.floor(Math.random() * ayat.length)]);
                }
            case 'سؤال':
            case 'سؤال_عام':
                {
                    const qs = [
                        'ما هو أكبر كوكب في المجموعة الشمسية؟',
                        'ما اسم عاصمة اليابان؟',
                        'من هو مخترع الهاتف؟'
                    ];
                    return message.channel.send(qs[Math.floor(Math.random() * qs.length)]);
                }
            case 'جواب':
                {
                    const answers = [
                        'أكبر كوكب هو المشترى.',
                        'عاصمة اليابان هي طوكيو.',
                        'مخترع الهاتف هو غراهام بيل.'
                    ];
                    return message.channel.send(answers[Math.floor(Math.random() * answers.length)]);
                }
            case 'كود':
                return message.channel.send('الكود الخاص بك هو: ' + Math.floor(Math.random() * 100000));
            case 'لون':
                {
                    const colors = ['أحمر', 'أخضر', 'أزرق', 'أصفر', 'بنفسجي', 'وردي', 'برتقالي'];
                    return message.channel.send('لونك اليوم هو: ' + colors[Math.floor(Math.random() * colors.length)]);
                }
            case 'حظ':
                {
                    const luck = ['جيد جدا', 'متوسط', 'سيء', 'ممتاز', 'رائع'];
                    return message.channel.send('حظك اليوم: ' + luck[Math.floor(Math.random() * luck.length)]);
                }
            case 'صورة':
            case 'صورة_عشوائية':
                {
                    const images = [
                        'https://picsum.photos/400',
                        'https://placekitten.com/400/400',
                        'https://placebear.com/400/400'
                    ];
                    return message.channel.send(images[Math.floor(Math.random() * images.length)]);
                }
            case 'صورة_عضو':
                {
                    if (!message.mentions.users.first()) return message.channel.send
