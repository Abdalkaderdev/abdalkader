import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LordsPrayer.module.scss';

interface Prayer {
    title: string;
    lines: string[];
    ending?: string;
    category: string;
}

const prayers: Prayer[] = [
    // === TRADITIONAL PRAYERS ===
    {
        category: "Traditional",
        title: "The Lord's Prayer",
        lines: [
            "Our Father, who art",
            "in Heaven, hallowed",
            "be Thy name, Thy",
            "Kingdom come, Thy",
            "will be done, on",
            "Earth as it is in",
            "Heaven. Give us this",
            "day our daily bread.",
            "And forgive us our",
            "trespasses, as we",
            "forgive those who",
            "trespass against us.",
            "And lead us not",
            "into temptation,",
            "but deliver us",
            "from evil."
        ],
        ending: "Amen."
    },
    {
        category: "Traditional",
        title: "The Apostles' Creed",
        lines: [
            "I believe in God,",
            "the Father Almighty,",
            "Creator of heaven and earth.",
            "And in Jesus Christ,",
            "His only Son, our Lord,",
            "who was conceived",
            "by the Holy Spirit,",
            "born of the Virgin Mary,",
            "suffered under Pontius Pilate,",
            "was crucified, died,",
            "and was buried.",
            "On the third day",
            "He rose again.",
            "He ascended into heaven",
            "and is seated at the",
            "right hand of the Father."
        ],
        ending: "Amen."
    },
    {
        category: "Traditional",
        title: "Glory Be",
        lines: [
            "Glory be to the Father,",
            "and to the Son,",
            "and to the Holy Spirit.",
            "As it was in the beginning,",
            "is now, and ever shall be,",
            "world without end."
        ],
        ending: "Amen."
    },
    {
        category: "Traditional",
        title: "The Jesus Prayer",
        lines: [
            "Lord Jesus Christ,",
            "Son of God,",
            "have mercy on me,",
            "a sinner."
        ],
        ending: "Amen."
    },

    // === PSALMS ===
    {
        category: "Psalms",
        title: "Psalm 23",
        lines: [
            "The Lord is my shepherd,",
            "I shall not want.",
            "He makes me lie down",
            "in green pastures.",
            "He leads me beside",
            "still waters.",
            "He restores my soul.",
            "He guides me in paths",
            "of righteousness",
            "for His name's sake.",
            "Even though I walk",
            "through the valley",
            "of the shadow of death,",
            "I will fear no evil,",
            "for You are with me."
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 91:1-2",
        lines: [
            "He who dwells in the",
            "shelter of the Most High",
            "will rest in the shadow",
            "of the Almighty.",
            "I will say of the Lord,",
            "He is my refuge",
            "and my fortress,",
            "my God, in whom I trust."
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 46:10",
        lines: [
            "Be still,",
            "and know",
            "that I am God.",
            "I will be exalted",
            "among the nations,",
            "I will be exalted",
            "in the earth."
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 27:1",
        lines: [
            "The Lord is my light",
            "and my salvation—",
            "whom shall I fear?",
            "The Lord is the stronghold",
            "of my life—",
            "of whom shall I",
            "be afraid?"
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 139:23-24",
        lines: [
            "Search me, O God,",
            "and know my heart;",
            "test me and know",
            "my anxious thoughts.",
            "See if there is any",
            "offensive way in me,",
            "and lead me in the way",
            "everlasting."
        ],
        ending: "Amen."
    },

    // === PRAYERS FOR GUIDANCE ===
    {
        category: "Guidance",
        title: "Prayer for Wisdom",
        lines: [
            "Lord, grant me wisdom",
            "to understand Your will.",
            "Give me clarity of mind",
            "and purity of heart.",
            "Help me to discern",
            "the path You have",
            "prepared for me,",
            "and courage to walk it."
        ],
        ending: "Amen."
    },
    {
        category: "Guidance",
        title: "Serenity Prayer",
        lines: [
            "God, grant me",
            "the serenity",
            "to accept the things",
            "I cannot change,",
            "the courage",
            "to change the things",
            "I can,",
            "and the wisdom",
            "to know",
            "the difference."
        ],
        ending: "Amen."
    },
    {
        category: "Guidance",
        title: "Prayer for Direction",
        lines: [
            "Heavenly Father,",
            "I seek Your guidance.",
            "Show me the way",
            "I should go.",
            "Open doors that",
            "should be opened,",
            "and close those",
            "that should be closed.",
            "Let Your will be done",
            "in my life."
        ],
        ending: "Amen."
    },

    // === PRAYERS FOR PEACE ===
    {
        category: "Peace",
        title: "Prayer of St. Francis",
        lines: [
            "Lord, make me",
            "an instrument",
            "of Your peace.",
            "Where there is hatred,",
            "let me sow love;",
            "where there is injury,",
            "pardon;",
            "where there is doubt,",
            "faith;",
            "where there is despair,",
            "hope;",
            "where there is darkness,",
            "light;",
            "where there is sadness,",
            "joy."
        ],
        ending: "Amen."
    },
    {
        category: "Peace",
        title: "Prayer for Inner Peace",
        lines: [
            "Lord, calm my anxious heart.",
            "Quiet the storms within me.",
            "Let Your peace,",
            "which surpasses",
            "all understanding,",
            "guard my heart",
            "and my mind",
            "in Christ Jesus."
        ],
        ending: "Amen."
    },
    {
        category: "Peace",
        title: "Celtic Peace Prayer",
        lines: [
            "Deep peace of the",
            "running wave to you.",
            "Deep peace of the",
            "flowing air to you.",
            "Deep peace of the",
            "quiet earth to you.",
            "Deep peace of the",
            "shining stars to you.",
            "Deep peace of the",
            "Son of Peace to you."
        ],
        ending: "Amen."
    },

    // === PRAYERS FOR STRENGTH ===
    {
        category: "Strength",
        title: "Prayer for Strength",
        lines: [
            "Lord, be my strength",
            "when I am weak.",
            "Be my courage",
            "when I am afraid.",
            "Be my comfort",
            "when I am troubled.",
            "Be my hope",
            "when I am in despair.",
            "I can do all things",
            "through You who",
            "strengthens me."
        ],
        ending: "Amen."
    },
    {
        category: "Strength",
        title: "Prayer in Times of Trial",
        lines: [
            "Father, in this trial,",
            "I trust in You.",
            "Though I walk through",
            "the fire, I will not",
            "be burned.",
            "Though I pass through",
            "the waters, I will not",
            "be overwhelmed.",
            "You are with me always."
        ],
        ending: "Amen."
    },

    // === MORNING PRAYERS ===
    {
        category: "Morning",
        title: "Morning Offering",
        lines: [
            "O Jesus, through the",
            "Immaculate Heart of Mary,",
            "I offer You my prayers,",
            "works, joys, and sufferings",
            "of this day",
            "for all the intentions",
            "of Your Sacred Heart.",
            "Bless this day",
            "and all whom I meet."
        ],
        ending: "Amen."
    },
    {
        category: "Morning",
        title: "Prayer to Start the Day",
        lines: [
            "Lord, as I begin this day,",
            "fill me with Your Spirit.",
            "Guide my thoughts,",
            "my words, my actions.",
            "Let me be a light",
            "to those around me.",
            "May everything I do",
            "bring glory to Your name."
        ],
        ending: "Amen."
    },

    // === EVENING PRAYERS ===
    {
        category: "Evening",
        title: "Evening Prayer",
        lines: [
            "Lord, as this day ends,",
            "I thank You for Your",
            "presence and protection.",
            "Forgive me where I",
            "have fallen short.",
            "Grant me peaceful rest",
            "and renew my spirit",
            "for tomorrow."
        ],
        ending: "Amen."
    },
    {
        category: "Evening",
        title: "Night Prayer",
        lines: [
            "Into Your hands, O Lord,",
            "I commend my spirit.",
            "Watch over me",
            "as I sleep tonight.",
            "Let Your angels",
            "guard my rest.",
            "Wake me renewed",
            "in Your love."
        ],
        ending: "Amen."
    },

    // === GRATITUDE PRAYERS ===
    {
        category: "Gratitude",
        title: "Prayer of Thanksgiving",
        lines: [
            "Thank You, Lord,",
            "for Your countless blessings.",
            "For life and health,",
            "for family and friends,",
            "for provision and protection.",
            "For Your unfailing love",
            "and endless grace.",
            "My heart overflows",
            "with gratitude."
        ],
        ending: "Amen."
    },
    {
        category: "Gratitude",
        title: "Gratitude for Grace",
        lines: [
            "Father, I thank You",
            "for Your amazing grace.",
            "Grace that saved me,",
            "grace that keeps me,",
            "grace that leads me home.",
            "I am forever grateful",
            "for Your love."
        ],
        ending: "Amen."
    },

    // === PRAYERS FROM SAINTS ===
    {
        category: "Saints",
        title: "St. Patrick's Breastplate",
        lines: [
            "Christ with me,",
            "Christ before me,",
            "Christ behind me,",
            "Christ in me,",
            "Christ beneath me,",
            "Christ above me,",
            "Christ on my right,",
            "Christ on my left,",
            "Christ when I lie down,",
            "Christ when I sit down,",
            "Christ when I arise."
        ],
        ending: "Amen."
    },
    {
        category: "Saints",
        title: "St. Augustine's Prayer",
        lines: [
            "You have made us",
            "for Yourself, O Lord,",
            "and our hearts",
            "are restless",
            "until they rest",
            "in You."
        ],
        ending: "Amen."
    },
    {
        category: "Saints",
        title: "St. Teresa's Bookmark",
        lines: [
            "Let nothing disturb you,",
            "let nothing frighten you.",
            "All things are passing;",
            "God never changes.",
            "Patience obtains all things.",
            "Whoever has God",
            "lacks nothing.",
            "God alone suffices."
        ],
        ending: "Amen."
    },

    // === PROTECTION PRAYERS ===
    {
        category: "Protection",
        title: "Prayer for Protection",
        lines: [
            "Lord, cover me with",
            "Your precious blood.",
            "Surround me with",
            "Your holy angels.",
            "Shield me from",
            "all evil and harm.",
            "Be my refuge and",
            "my fortress today."
        ],
        ending: "Amen."
    },
    {
        category: "Protection",
        title: "Guardian Angel Prayer",
        lines: [
            "Angel of God,",
            "my guardian dear,",
            "to whom God's love",
            "commits me here,",
            "ever this day",
            "be at my side,",
            "to light and guard,",
            "to rule and guide."
        ],
        ending: "Amen."
    },

    // === HEALING PRAYERS ===
    {
        category: "Healing",
        title: "Prayer for Healing",
        lines: [
            "Lord Jesus, You are",
            "the Great Physician.",
            "Lay Your healing hands",
            "upon me now.",
            "Restore my body,",
            "renew my mind,",
            "refresh my spirit.",
            "By Your stripes",
            "I am healed."
        ],
        ending: "Amen."
    },
    {
        category: "Healing",
        title: "Prayer for the Sick",
        lines: [
            "Heavenly Father,",
            "I lift up all who",
            "are suffering today.",
            "Bring comfort to",
            "the afflicted,",
            "hope to the discouraged,",
            "and healing to the sick.",
            "Let Your mercy flow."
        ],
        ending: "Amen."
    },

    // === FAITH PRAYERS ===
    {
        category: "Faith",
        title: "Prayer for Faith",
        lines: [
            "Lord, I believe;",
            "help my unbelief.",
            "Strengthen my faith",
            "when doubts arise.",
            "Help me to trust",
            "in Your promises,",
            "even when I cannot",
            "see the way ahead."
        ],
        ending: "Amen."
    },
    {
        category: "Faith",
        title: "Trust in God",
        lines: [
            "Father, I place my trust",
            "entirely in You.",
            "Not in my own strength,",
            "not in my own wisdom,",
            "but in Your faithfulness",
            "that never fails.",
            "You are my rock",
            "and my salvation."
        ],
        ending: "Amen."
    },

    // === ADDITIONAL PSALMS ===
    {
        category: "Psalms",
        title: "Psalm 51:10-12 (Create in Me)",
        lines: [
            "Create in me a clean heart,",
            "O God, and renew",
            "a right spirit within me.",
            "Cast me not away",
            "from Your presence,",
            "and take not Your",
            "Holy Spirit from me.",
            "Restore to me the joy",
            "of Your salvation,",
            "and uphold me with",
            "a willing spirit."
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 100 (Joyful Praise)",
        lines: [
            "Make a joyful noise",
            "to the Lord, all the earth!",
            "Serve the Lord with gladness!",
            "Come into His presence",
            "with singing!",
            "Know that the Lord, He is God!",
            "It is He who made us,",
            "and we are His;",
            "we are His people,",
            "and the sheep of His pasture."
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 121 (I Lift My Eyes)",
        lines: [
            "I lift up my eyes",
            "to the mountains—",
            "where does my help come from?",
            "My help comes from the Lord,",
            "the Maker of heaven and earth.",
            "He will not let your foot slip—",
            "He who watches over you",
            "will not slumber.",
            "The Lord watches over you—",
            "the Lord is your shade",
            "at your right hand."
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 150 (Praise the Lord)",
        lines: [
            "Praise the Lord!",
            "Praise God in His sanctuary;",
            "praise Him in His",
            "mighty heavens!",
            "Praise Him for",
            "His mighty deeds;",
            "praise Him according to",
            "His excellent greatness!",
            "Let everything that",
            "has breath",
            "praise the Lord!"
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 103:1-5 (Bless the Lord)",
        lines: [
            "Bless the Lord, O my soul,",
            "and all that is within me,",
            "bless His holy name!",
            "Bless the Lord, O my soul,",
            "and forget not all His benefits,",
            "who forgives all your iniquity,",
            "who heals all your diseases,",
            "who redeems your life",
            "from the pit,",
            "who crowns you with",
            "steadfast love and mercy."
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 34:1-4 (I Will Bless)",
        lines: [
            "I will bless the Lord",
            "at all times;",
            "His praise shall",
            "continually be in my mouth.",
            "My soul makes its boast",
            "in the Lord;",
            "let the humble hear",
            "and be glad.",
            "I sought the Lord,",
            "and He answered me",
            "and delivered me",
            "from all my fears."
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 42:1-2 (As the Deer)",
        lines: [
            "As the deer pants",
            "for streams of water,",
            "so my soul pants",
            "for You, my God.",
            "My soul thirsts for God,",
            "for the living God.",
            "When can I go and meet",
            "with God?"
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 63:1-4 (O God, You Are My God)",
        lines: [
            "O God, You are my God;",
            "earnestly I seek You;",
            "my soul thirsts for You;",
            "my flesh faints for You,",
            "as in a dry and weary land",
            "where there is no water.",
            "Because Your steadfast love",
            "is better than life,",
            "my lips will praise You."
        ],
        ending: "Amen."
    },

    // === MARIAN PRAYERS ===
    {
        category: "Marian",
        title: "Hail Mary",
        lines: [
            "Hail Mary, full of grace,",
            "the Lord is with thee.",
            "Blessed art thou",
            "among women,",
            "and blessed is the fruit",
            "of thy womb, Jesus.",
            "Holy Mary, Mother of God,",
            "pray for us sinners,",
            "now and at the hour",
            "of our death."
        ],
        ending: "Amen."
    },
    {
        category: "Marian",
        title: "The Memorare",
        lines: [
            "Remember, O most gracious",
            "Virgin Mary,",
            "that never was it known",
            "that anyone who fled",
            "to thy protection,",
            "implored thy help,",
            "or sought thy intercession",
            "was left unaided.",
            "Inspired by this confidence,",
            "I fly unto thee,",
            "O Virgin of virgins,",
            "my Mother."
        ],
        ending: "Amen."
    },
    {
        category: "Marian",
        title: "Hail Holy Queen",
        lines: [
            "Hail, holy Queen,",
            "Mother of Mercy,",
            "our life, our sweetness,",
            "and our hope.",
            "To thee do we cry,",
            "poor banished",
            "children of Eve.",
            "Turn then, most gracious",
            "Advocate, thine eyes",
            "of mercy toward us."
        ],
        ending: "Amen."
    },
    {
        category: "Marian",
        title: "The Angelus",
        lines: [
            "The Angel of the Lord",
            "declared unto Mary,",
            "and she conceived",
            "by the Holy Spirit.",
            "Behold the handmaid",
            "of the Lord.",
            "Be it done unto me",
            "according to Thy word.",
            "And the Word was made flesh",
            "and dwelt among us."
        ],
        ending: "Amen."
    },

    // === PRAYERS FOR WORK ===
    {
        category: "Work",
        title: "Prayer Before Work",
        lines: [
            "Lord, as I begin my work,",
            "bless the labor of my hands.",
            "Grant me focus and clarity,",
            "wisdom and creativity.",
            "May my efforts honor You",
            "and serve others well.",
            "Help me to work",
            "as unto the Lord,",
            "not unto men."
        ],
        ending: "Amen."
    },
    {
        category: "Work",
        title: "Prayer for Creativity",
        lines: [
            "Creator God,",
            "You who made all things,",
            "inspire my mind",
            "and guide my hands.",
            "Grant me fresh ideas",
            "and innovative solutions.",
            "May the work I create",
            "reflect Your creativity",
            "and bring You glory."
        ],
        ending: "Amen."
    },
    {
        category: "Work",
        title: "Prayer for Business",
        lines: [
            "Lord, bless my business",
            "and all who work with me.",
            "Grant us integrity",
            "in every dealing,",
            "wisdom in every decision,",
            "and success that glorifies You.",
            "May we serve others well",
            "and prosper according",
            "to Your will."
        ],
        ending: "Amen."
    },
    {
        category: "Work",
        title: "Prayer for Coworkers",
        lines: [
            "Father, I lift up",
            "my colleagues to You.",
            "Bless them in their work,",
            "grant them peace at home,",
            "and draw them close to You.",
            "Help us work together",
            "in harmony and respect.",
            "May our workplace",
            "reflect Your love."
        ],
        ending: "Amen."
    },
    {
        category: "Work",
        title: "Prayer for Difficult Work",
        lines: [
            "Lord, this task is hard,",
            "but nothing is impossible",
            "with You.",
            "Give me perseverance",
            "when I want to quit,",
            "patience when I am frustrated,",
            "and faith that You are",
            "working through me."
        ],
        ending: "Amen."
    },

    // === PRAYERS FOR FAMILY ===
    {
        category: "Family",
        title: "Prayer for Children",
        lines: [
            "Heavenly Father,",
            "I entrust my children to You.",
            "Protect them from harm,",
            "guide their steps,",
            "and draw their hearts to You.",
            "Give them wisdom beyond",
            "their years and faith",
            "that never wavers.",
            "Bless them all their days."
        ],
        ending: "Amen."
    },
    {
        category: "Family",
        title: "Prayer for Parents",
        lines: [
            "Lord, bless my parents",
            "who gave me life.",
            "Reward their sacrifices,",
            "heal their hurts,",
            "and grant them peace.",
            "Help me to honor them",
            "in word and deed.",
            "May they know Your love",
            "through mine."
        ],
        ending: "Amen."
    },
    {
        category: "Family",
        title: "Prayer for Marriage",
        lines: [
            "Lord, bless this marriage",
            "You have joined together.",
            "Strengthen our love,",
            "deepen our commitment,",
            "and renew our devotion.",
            "Help us to forgive quickly,",
            "love unconditionally,",
            "and serve each other",
            "as You have served us."
        ],
        ending: "Amen."
    },
    {
        category: "Family",
        title: "Blessing for the Home",
        lines: [
            "Lord, bless this home",
            "and all who dwell within.",
            "May Your peace fill",
            "every room,",
            "Your love unite every heart,",
            "and Your presence",
            "make it sacred ground.",
            "Let this home be",
            "a refuge of grace."
        ],
        ending: "Amen."
    },
    {
        category: "Family",
        title: "Prayer for Family Unity",
        lines: [
            "Father, bind our family",
            "together in love.",
            "Heal any divisions,",
            "mend any brokenness,",
            "and restore any rifts.",
            "Help us to bear with",
            "one another in patience,",
            "forgiving as You",
            "have forgiven us."
        ],
        ending: "Amen."
    },
    {
        category: "Family",
        title: "Grace Before Meals",
        lines: [
            "Bless us, O Lord,",
            "and these Thy gifts,",
            "which we are about to receive",
            "from Thy bounty,",
            "through Christ our Lord.",
            "Bless the hands",
            "that prepared this meal,",
            "and bless all gathered here."
        ],
        ending: "Amen."
    },

    // === PRAYERS FOR FORGIVENESS ===
    {
        category: "Forgiveness",
        title: "Act of Contrition",
        lines: [
            "O my God, I am heartily sorry",
            "for having offended Thee,",
            "and I detest all my sins",
            "because of Thy just punishments,",
            "but most of all because",
            "they offend Thee, my God,",
            "who art all good and",
            "deserving of all my love.",
            "I firmly resolve,",
            "with the help of Thy grace,",
            "to sin no more."
        ],
        ending: "Amen."
    },
    {
        category: "Forgiveness",
        title: "Prayer for Repentance",
        lines: [
            "Lord, I come before You",
            "broken and ashamed.",
            "I have sinned against You",
            "and against others.",
            "I ask for Your mercy",
            "and Your cleansing.",
            "Create in me a new heart",
            "and restore me",
            "to right relationship with You."
        ],
        ending: "Amen."
    },
    {
        category: "Forgiveness",
        title: "Prayer for Mercy",
        lines: [
            "Lord, have mercy on me,",
            "a sinner.",
            "Though my sins are many,",
            "Your mercy is greater still.",
            "Do not remember",
            "the sins of my youth,",
            "but according to Your love,",
            "remember me."
        ],
        ending: "Amen."
    },
    {
        category: "Forgiveness",
        title: "Prayer to Forgive Others",
        lines: [
            "Father, help me to forgive",
            "those who have hurt me.",
            "Release me from bitterness,",
            "free me from resentment,",
            "and heal my wounded heart.",
            "As You have forgiven me,",
            "help me to forgive others,",
            "completely and freely."
        ],
        ending: "Amen."
    },
    {
        category: "Forgiveness",
        title: "Confession of God's Mercy",
        lines: [
            "I believe, O Lord,",
            "that Your mercy is endless,",
            "Your compassion inexhaustible,",
            "and Your love unfailing.",
            "Though I have wandered far,",
            "You welcome me home.",
            "Though I have failed often,",
            "You never give up on me."
        ],
        ending: "Amen."
    },

    // === PRAYERS FOR THE WORLD ===
    {
        category: "World",
        title: "Prayer for Peace",
        lines: [
            "Lord, we pray for peace",
            "in our world.",
            "Where there is war,",
            "bring reconciliation.",
            "Where there is hatred,",
            "sow seeds of love.",
            "Raise up peacemakers",
            "and silence the drums of war.",
            "Let Your kingdom come."
        ],
        ending: "Amen."
    },
    {
        category: "World",
        title: "Prayer for Nations",
        lines: [
            "Sovereign Lord,",
            "You raise up nations",
            "and bring them low.",
            "Bless the nations of the earth.",
            "Turn the hearts of peoples",
            "toward justice and mercy.",
            "May every nation seek peace",
            "and pursue righteousness."
        ],
        ending: "Amen."
    },
    {
        category: "World",
        title: "Prayer for Leaders",
        lines: [
            "Father, we lift up",
            "our leaders to You.",
            "Grant them wisdom",
            "to govern justly,",
            "courage to do what is right,",
            "and humility to serve",
            "those in their care.",
            "May they lead according",
            "to Your ways."
        ],
        ending: "Amen."
    },
    {
        category: "World",
        title: "Prayer for the Poor",
        lines: [
            "Lord, we pray for the poor,",
            "the hungry, and the homeless.",
            "Open our eyes to see them,",
            "our hearts to love them,",
            "and our hands to help them.",
            "Provide for their needs",
            "and restore their dignity.",
            "Make us instruments",
            "of Your compassion."
        ],
        ending: "Amen."
    },
    {
        category: "World",
        title: "Prayer for the Persecuted",
        lines: [
            "Father, we remember",
            "our brothers and sisters",
            "who suffer for their faith.",
            "Strengthen the persecuted,",
            "comfort the afflicted,",
            "and vindicate the oppressed.",
            "Grant them courage",
            "to stand firm,",
            "and bring justice in Your time."
        ],
        ending: "Amen."
    },

    // === BEATITUDES ===
    {
        category: "Beatitudes",
        title: "The Beatitudes (Matthew 5)",
        lines: [
            "Blessed are the poor in spirit,",
            "for theirs is the",
            "kingdom of heaven.",
            "Blessed are those who mourn,",
            "for they shall be comforted.",
            "Blessed are the meek,",
            "for they shall",
            "inherit the earth.",
            "Blessed are those who hunger",
            "and thirst for righteousness,",
            "for they shall be satisfied.",
            "Blessed are the merciful,",
            "for they shall receive mercy.",
            "Blessed are the pure in heart,",
            "for they shall see God."
        ],
        ending: "Amen."
    },
    {
        category: "Beatitudes",
        title: "Beatitudes: Peacemakers",
        lines: [
            "Blessed are the peacemakers,",
            "for they shall be called",
            "children of God.",
            "Blessed are those who are",
            "persecuted for righteousness,",
            "for theirs is the",
            "kingdom of heaven.",
            "Rejoice and be glad,",
            "for your reward is great",
            "in heaven."
        ],
        ending: "Amen."
    },
    {
        category: "Beatitudes",
        title: "Prayer of Beatitude Living",
        lines: [
            "Lord, help me to live",
            "the Beatitudes each day.",
            "Make me poor in spirit,",
            "humble and dependent on You.",
            "Give me a heart that mourns",
            "for sin and injustice.",
            "Teach me meekness and mercy,",
            "purity and peace.",
            "May I be blessed in You."
        ],
        ending: "Amen."
    },

    // === BENEDICTIONS ===
    {
        category: "Benediction",
        title: "The Aaronic Blessing",
        lines: [
            "The Lord bless you",
            "and keep you;",
            "the Lord make His face",
            "shine upon you",
            "and be gracious to you;",
            "the Lord turn His face",
            "toward you",
            "and give you peace."
        ],
        ending: "Amen."
    },
    {
        category: "Benediction",
        title: "Apostolic Benediction",
        lines: [
            "The grace of the Lord",
            "Jesus Christ,",
            "and the love of God,",
            "and the fellowship of",
            "the Holy Spirit",
            "be with you all."
        ],
        ending: "Amen."
    },
    {
        category: "Benediction",
        title: "Doxology",
        lines: [
            "Praise God, from whom",
            "all blessings flow;",
            "Praise Him, all creatures",
            "here below;",
            "Praise Him above,",
            "ye heavenly host;",
            "Praise Father, Son,",
            "and Holy Ghost."
        ],
        ending: "Amen."
    },
    {
        category: "Benediction",
        title: "Jude Benediction",
        lines: [
            "To Him who is able",
            "to keep you from falling",
            "and to present you",
            "before His glorious presence",
            "without fault",
            "and with great joy—",
            "to the only God our Savior",
            "be glory, majesty,",
            "power and authority."
        ],
        ending: "Amen."
    },
    {
        category: "Benediction",
        title: "Irish Blessing",
        lines: [
            "May the road rise up",
            "to meet you.",
            "May the wind be always",
            "at your back.",
            "May the sun shine warm",
            "upon your face,",
            "the rains fall soft",
            "upon your fields,",
            "and until we meet again,",
            "may God hold you",
            "in the palm of His hand."
        ],
        ending: "Amen."
    },
    {
        category: "Benediction",
        title: "Hebrews Benediction",
        lines: [
            "Now may the God of peace,",
            "who through the blood",
            "of the eternal covenant",
            "brought back from the dead",
            "our Lord Jesus,",
            "that great Shepherd",
            "of the sheep,",
            "equip you with everything good",
            "for doing His will."
        ],
        ending: "Amen."
    },
    {
        category: "Benediction",
        title: "Romans Benediction",
        lines: [
            "May the God of hope",
            "fill you with all joy and peace",
            "as you trust in Him,",
            "so that you may overflow",
            "with hope",
            "by the power of",
            "the Holy Spirit."
        ],
        ending: "Amen."
    }
];

// Get unique categories
const categories = Array.from(new Set(prayers.map(p => p.category)));

interface LordsPrayerProps {
    className?: string;
}

export default function LordsPrayer({ className = '' }: LordsPrayerProps) {
    const [currentPrayerIndex, setCurrentPrayerIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(true);

    // Filter prayers by category
    const filteredPrayers = selectedCategory
        ? prayers.filter(p => p.category === selectedCategory)
        : prayers;

    const currentPrayer = filteredPrayers[currentPrayerIndex % filteredPrayers.length];

    const nextPrayer = useCallback(() => {
        setIsAnimating(false);
        setTimeout(() => {
            setCurrentPrayerIndex((prev) => (prev + 1) % filteredPrayers.length);
            setIsAnimating(true);
        }, 500);
    }, [filteredPrayers.length]);

    const prevPrayer = useCallback(() => {
        setIsAnimating(false);
        setTimeout(() => {
            setCurrentPrayerIndex((prev) => (prev - 1 + filteredPrayers.length) % filteredPrayers.length);
            setIsAnimating(true);
        }, 500);
    }, [filteredPrayers.length]);

    // Reset index when category changes
    useEffect(() => {
        setCurrentPrayerIndex(0);
        setIsAnimating(true);
    }, [selectedCategory]);

    // Auto-advance prayers every 45 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            nextPrayer();
        }, 45000);

        return () => clearInterval(timer);
    }, [nextPrayer]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextPrayer();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevPrayer();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextPrayer, prevPrayer]);

    return (
        <div className={`${styles.lordsPrayer} ${className}`}>
            {/* Ambient glow effects */}
            <div className={styles.ambientGlow} />
            <div className={styles.ambientGlow2} />

            {/* Category Filter */}
            <div className={styles.categoryFilter}>
                <button
                    className={`${styles.categoryButton} ${selectedCategory === null ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(null)}
                >
                    All ({prayers.length})
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category} ({prayers.filter(p => p.category === category).length})
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={`${selectedCategory}-${currentPrayerIndex}`}
                    className={styles.prayerContainer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Cross */}
                    <motion.div
                        className={styles.cross}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        &#10013;
                    </motion.div>

                    {/* Category Badge */}
                    <motion.span
                        className={styles.categoryBadge}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {currentPrayer.category}
                    </motion.span>

                    {/* Prayer Title */}
                    <motion.h2
                        className={styles.prayerTitle}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {currentPrayer.title}
                    </motion.h2>

                    {/* Prayer Text */}
                    <div className={styles.prayerText}>
                        {isAnimating && currentPrayer.lines.map((line, index) => (
                            <motion.p
                                key={`${currentPrayerIndex}-${index}`}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.4 + index * 0.08,
                                    ease: "easeOut"
                                }}
                            >
                                {line}
                            </motion.p>
                        ))}

                        {/* Ending (Amen) */}
                        {isAnimating && currentPrayer.ending && (
                            <motion.p
                                className={styles.ending}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.4 + currentPrayer.lines.length * 0.08 + 0.3,
                                    ease: "easeOut"
                                }}
                            >
                                {currentPrayer.ending}
                            </motion.p>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className={styles.navigation}>
                <button
                    onClick={prevPrayer}
                    className={styles.navButton}
                    aria-label="Previous prayer"
                >
                    &larr;
                </button>
                <div className={styles.prayerCount}>
                    {(currentPrayerIndex % filteredPrayers.length) + 1} / {filteredPrayers.length}
                </div>
                <button
                    onClick={nextPrayer}
                    className={styles.navButton}
                    aria-label="Next prayer"
                >
                    &rarr;
                </button>
            </div>

            {/* Instructions */}
            <motion.p
                className={styles.instructions}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
            >
                Use arrow keys or tap to navigate &bull; Auto-advances every 45 seconds
            </motion.p>
        </div>
    );
}
