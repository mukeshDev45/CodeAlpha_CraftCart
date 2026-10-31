const sampleProducts = [
  // --- ELECTRONICS ---
  {
    name: 'AuraCraft Walnut Wireless Charging Stand',
    description: 'Elevate your workspace with our handcrafted solid walnut wireless charging stand. Compatible with all Qi-enabled smartphones, featuring dual copper induction coils for portrait and landscape charging, backed by soft non-scratch felt.',
    shortDescription: 'Solid American walnut charging stand with fast Qi dual-coil inductive charging.',
    price: 2499,
    originalPrice: 3499,
    category: 'Electronics',
    subcategory: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    rating: 4.8,
    numReviews: 28,
    featured: true,
    isBestSeller: true,
    isTrending: true,
    isNewArrival: false,
    tags: ['wireless charger', 'walnut', 'desk setup', 'qi charging'],
    highlights: ['Solid sustainably sourced walnut', '15W Fast Qi Charging', 'Overheat protection system']
  },
  {
    name: 'Nordic Wood Wireless Bluetooth Speaker',
    description: 'Immerse yourself in rich, acoustic warmth. Housed inside steam-bent Nordic birch with an acoustic tweed grille, delivering 360-degree room-filling stereo sound with up to 16 hours of continuous battery playback.',
    shortDescription: 'Bent birch wood speaker with dual passive radiators and 16-hour playtime.',
    price: 3999,
    originalPrice: 5499,
    category: 'Electronics',
    subcategory: 'Audio',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    rating: 4.9,
    numReviews: 42,
    featured: true,
    isBestSeller: true,
    isTrending: false,
    isNewArrival: false,
    tags: ['speaker', 'bluetooth', 'wood speaker', 'audio'],
    highlights: ['Bluetooth 5.3 + AUX input', '16-Hour lithium battery', 'Deep bass reflex chamber']
  },
  {
    name: 'Artisan Mechanical Keyboard with Walnut Wrist Rest',
    description: 'A tactile masterpiece built for precision writers and creators. Features lubricated Gateron Pro switches, hot-swappable PCB, PBT dye-sublimated retro keycaps, and a sculptured solid walnut magnetic wrist rest.',
    shortDescription: 'Custom 75% mechanical keyboard with PBT keycaps and magnetic walnut wrist rest.',
    price: 5499,
    originalPrice: 7999,
    category: 'Electronics',
    subcategory: 'Peripherals',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 14,
    rating: 4.7,
    numReviews: 35,
    featured: false,
    isBestSeller: false,
    isTrending: true,
    isNewArrival: true,
    tags: ['mechanical keyboard', 'custom keyboard', 'gateron', 'desk setup'],
    highlights: ['Hot-swappable 5-pin switches', 'South-facing warm white LEDs', 'Walnut ergonomic rest']
  },
  {
    name: 'VibeStudio Retro Acoustic Over-Ear Headphones',
    description: 'Engineered for audio purists, these vintage-inspired studio cans feature custom 50mm neodymium transducers, hand-stitched memory foam leather ear cushions, and brass adjustment sliders for sublime comfort.',
    shortDescription: 'Vintage-inspired audiophile headphones with beryllium-coated drivers.',
    price: 6499,
    originalPrice: 8999,
    category: 'Electronics',
    subcategory: 'Audio',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    rating: 4.9,
    numReviews: 19,
    featured: true,
    isBestSeller: false,
    isTrending: false,
    isNewArrival: true,
    tags: ['headphones', 'audiophile', 'retro', 'studio'],
    highlights: ['50mm Neodymium dynamic drivers', 'Detachable braided oxygen-free copper cable', 'Full noise-isolation cups']
  },
  {
    name: 'Handcrafted Brass & Oak Desk Ambient Lamp',
    description: 'A touch of industrial elegance for your nightstand or study desk. Precision-machined solid brass fixture mounted upon an oiled oak plinth, paired with an amber filament Edison bulb and smooth stepless dimmer.',
    shortDescription: 'Stepless dimmable solid brass & oak Edison ambient desk lamp.',
    price: 1899,
    originalPrice: 2699,
    category: 'Electronics',
    subcategory: 'Lighting',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 20,
    rating: 4.6,
    numReviews: 16,
    featured: false,
    isBestSeller: false,
    isTrending: false,
    isNewArrival: true,
    tags: ['lamp', 'lighting', 'brass', 'edison bulb'],
    highlights: ['Solid turned brass hardware', 'Rotary brass stepless dimmer switch', 'Warm 2200K Edison bulb included']
  },

  // --- FASHION ---
  {
    name: 'Handwoven Pure Khadi Cotton Overshirt',
    description: 'Woven on traditional wooden looms by heritage artisans in Gujarat. Breathable, textured pure organic cotton yarn dyed with gentle botanical pigments. Features genuine corozo nut buttons and double chest patch pockets.',
    shortDescription: 'Organic handspun khadi overshirt with corozo nut buttons.',
    price: 2199,
    originalPrice: 3199,
    category: 'Fashion',
    subcategory: 'Men',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 22,
    rating: 4.7,
    numReviews: 24,
    featured: true,
    isBestSeller: true,
    isTrending: true,
    isNewArrival: false,
    tags: ['khadi', 'handwoven', 'cotton', 'sustainable'],
    highlights: ['100% GOTS certified organic cotton', 'Dyed with natural botanicals', 'Hand-stitched reinforced seams']
  },
  {
    name: 'Artisan Full-Grain Leather Chelsea Boots',
    description: 'Crafted from supple pull-up oil-tanned leather that patinas beautifully with every step. Goodyear welted with slip-resistant Dainite rubber outsoles and elasticated side gussets for effortless pull-on comfort.',
    shortDescription: 'Hand-burnished pull-up leather Chelsea boots with Goodyear welted soles.',
    price: 4999,
    originalPrice: 7499,
    category: 'Fashion',
    subcategory: 'Footwear',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 16,
    rating: 4.9,
    numReviews: 31,
    featured: true,
    isBestSeller: false,
    isTrending: true,
    isNewArrival: false,
    tags: ['boots', 'chelsea boots', 'leather', 'footwear'],
    highlights: ['Goodyear welt construction', 'Full-grain vegetable tanned leather', 'Shock-absorbing cork bed']
  },
  {
    name: 'Heritage Linen Blend Relaxed Trousers',
    description: 'Tailored for effortless sophistication in warm climates. Spun from European flax linen and fine cotton, featuring an elasticated drawstring waistband, pleat front detailing, and deep slash pockets.',
    shortDescription: 'Breathable flax linen relaxed trousers with drawcord waistband.',
    price: 1999,
    originalPrice: 2899,
    category: 'Fashion',
    subcategory: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 30,
    rating: 4.5,
    numReviews: 18,
    featured: false,
    isBestSeller: true,
    isTrending: false,
    isNewArrival: true,
    tags: ['linen', 'trousers', 'summer fashion', 'relaxed'],
    highlights: ['60% European Flax / 40% Cotton', 'Pre-washed for zero shrinkage', 'Concealed coin pocket']
  },
  {
    name: 'Handcrafted Silk Bandhani Scarf',
    description: 'An ode to centuries of royal tie-dye artistry. Hand-tied into thousands of intricate micro-knots on mulberry silk, hand-dipped in rich crimson and saffron dyes with delicate zari fringed borders.',
    shortDescription: 'Pure mulberry silk scarf dyed using intricate Rajasthani Bandhani art.',
    price: 1699,
    originalPrice: 2499,
    category: 'Fashion',
    subcategory: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    rating: 4.8,
    numReviews: 22,
    featured: false,
    isBestSeller: false,
    isTrending: false,
    isNewArrival: false,
    tags: ['silk', 'bandhani', 'scarf', 'ethnic'],
    highlights: ['100% Pure mulberry silk', 'Hand-knotted Bandhej technique', 'Metallic zari borders']
  },
  {
    name: 'Minimalist Indigo Washed Denim Jacket',
    description: 'Constructed from heavy 13.5oz raw selvedge cotton denim with an authentic stonewash patina. Detailed with custom antique copper shank buttons, side waist cinches, and reinforced flat-felled seams.',
    shortDescription: 'Classic 13.5oz selvedge denim trucker jacket in authentic indigo wash.',
    price: 3299,
    originalPrice: 4799,
    category: 'Fashion',
    subcategory: 'Men',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    rating: 4.6,
    numReviews: 29,
    featured: false,
    isBestSeller: false,
    isTrending: true,
    isNewArrival: true,
    tags: ['denim jacket', 'indigo', 'selvedge', 'outerwear'],
    highlights: ['13.5oz Ring-spun cotton', 'Selvedge edge detailing', 'Antique copper rivet accents']
  },

  // --- HOME & LIVING ---
  {
    name: 'Hand-Thrown Ceramic Coffee & Tea Set',
    description: 'Fired in a wood-burning kiln at 1280°C, this 4-piece ceramic set includes a pour-over dripper, server carafe, and two tactile handled tumblers. Finished in an organic speckled oatmeal glaze with exposed raw clay rims.',
    shortDescription: 'Stoneware 4-piece artisan coffee pour-over and tumbler serving set.',
    price: 1899,
    originalPrice: 2699,
    category: 'Home & Living',
    subcategory: 'Kitchen',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 20,
    rating: 4.9,
    numReviews: 38,
    featured: true,
    isBestSeller: true,
    isTrending: false,
    isNewArrival: false,
    tags: ['ceramics', 'coffee', 'pottery', 'tableware'],
    highlights: ['Food safe & microwave friendly', 'High-fired durable stoneware', 'Hand-glazed individual unique patterns']
  },
  {
    name: 'Terracotta Geometric Minimalist Vase Set',
    description: 'A sculptural duo of matte earthenware vases celebrating brutalist geometry and organic earthy tones. Perfect for dried botanical arrangements, pampas grass, or standing as architectural statement pieces on any shelf.',
    shortDescription: 'Architectural twin ceramic vases in earthy terracotta and sand.',
    price: 1299,
    originalPrice: 1799,
    category: 'Home & Living',
    subcategory: 'Decor',
    images: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    rating: 4.6,
    numReviews: 21,
    featured: false,
    isBestSeller: false,
    isTrending: true,
    isNewArrival: false,
    tags: ['vase', 'terracotta', 'decor', 'minimalist'],
    highlights: ['Handmade natural clay', 'Matte waterproof interior sealant', 'Felt base pads to protect furniture']
  },
  {
    name: 'Hand-Carved Sheesham Wood Serving Platter',
    description: 'Sculpted from a single block of mature Indian rosewood (Sheesham). Showcases deep golden-brown natural grain lines, organic bevelled handles, and a food-grade virgin beeswax hand polish.',
    shortDescription: 'Solid Sheesham wood charcuterie & serving board with beeswax finish.',
    price: 1499,
    originalPrice: 2199,
    category: 'Home & Living',
    subcategory: 'Kitchen',
    images: [
      'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 24,
    rating: 4.8,
    numReviews: 29,
    featured: true,
    isBestSeller: false,
    isTrending: false,
    isNewArrival: false,
    tags: ['wood', 'sheesham', 'platter', 'kitchen'],
    highlights: ['Single continuous wood slab', '100% Non-toxic beeswax finish', 'Anti-warp kiln-dried seasoning']
  },
  {
    name: 'Organic Waffle Weave Cotton Throw Blanket',
    description: 'Generously sized 130x180cm throw blanket woven with deep honeycomb waffle pockets that trap soothing warmth while remaining ultra-breathable. Crafted from combed organic long-staple cotton yarn in soothing moss sage.',
    shortDescription: 'Honeycomb waffle weave breathable throw blanket in sage green.',
    price: 2299,
    originalPrice: 3299,
    category: 'Home & Living',
    subcategory: 'Bedding',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 19,
    rating: 4.7,
    numReviews: 17,
    featured: false,
    isBestSeller: true,
    isTrending: false,
    isNewArrival: true,
    tags: ['throw blanket', 'cotton', 'waffle weave', 'bedding'],
    highlights: ['GOTS Organic certified cotton', 'Breathable four-season weight', 'Machine washable with zero linting']
  },
  {
    name: 'Brass Hand-Hammered Incense Burner & Candle Holder',
    description: 'Forged by skilled brass artisans using ancestral repoussé hammering techniques. Dual-purpose receptacle holding either aromatic dhoop incense cones, sticks, or tea-light candles, casting mesmerizing dappled shadows.',
    shortDescription: 'Hand-hammered brass artisanal incense burner with heat-shield base.',
    price: 999,
    originalPrice: 1499,
    category: 'Home & Living',
    subcategory: 'Aromatics',
    images: [
      'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 40,
    rating: 4.8,
    numReviews: 26,
    featured: false,
    isBestSeller: false,
    isTrending: false,
    isNewArrival: false,
    tags: ['brass', 'incense burner', 'candle holder', 'meditation'],
    highlights: ['Pure virgin brass casting', 'Includes heat-resistant wooden coaster', 'Anti-tarnish protective coating']
  },

  // --- ACCESSORIES ---
  {
    name: 'Full-Grain Saddle Tan Leather Bi-Fold Wallet',
    description: 'Hand-stitched using durable waxed polyester thread using the traditional saddle stitch technique that will outlive machine lockstitches. Holds 8-10 cards, unfolded banknotes, and includes built-in RFID blocking shield.',
    shortDescription: 'Hand saddle-stitched vegetable tanned leather wallet with RFID guard.',
    price: 1399,
    originalPrice: 1999,
    category: 'Accessories',
    subcategory: 'Wallets',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 28,
    rating: 4.9,
    numReviews: 45,
    featured: true,
    isBestSeller: true,
    isTrending: false,
    isNewArrival: false,
    tags: ['wallet', 'leather wallet', 'hand stitched', 'rfid'],
    highlights: ['Italian vegetable tanned leather', 'RFID radio frequency blocking layer', 'Burnished and beeswaxed edges']
  },
  {
    name: 'Minimalist Bauhaus Brass Mechanical Watch',
    description: 'An architectural timepiece inspired by mid-century Bauhaus design. Driven by a 24-jewel automatic mechanical movement with 41-hour reserve, sapphire crystal glass, brushed solid brass case, and Italian calfskin strap.',
    shortDescription: 'Automatic mechanical movement watch with sapphire crystal and brass case.',
    price: 7499,
    originalPrice: 9999,
    category: 'Accessories',
    subcategory: 'Watches',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    rating: 4.9,
    numReviews: 21,
    featured: true,
    isBestSeller: false,
    isTrending: true,
    isNewArrival: false,
    tags: ['watch', 'mechanical watch', 'bauhaus', 'brass'],
    highlights: ['24-Jewel self-winding automatic movement', 'Scratch-proof sapphire glass', '50-Meter water resistance']
  },
  {
    name: 'Handmade Canvas & Vegetable Leather Weekender Bag',
    description: 'Engineered for adventurous escapes. Built from heavy 18oz waterproof duck canvas with oil-tanned top-grain leather straps, solid brass hardware, YKK zippers, and a dedicated ventilated shoe compartment.',
    shortDescription: '18oz waxed canvas travel duffel with full-grain leather straps.',
    price: 3899,
    originalPrice: 5299,
    category: 'Accessories',
    subcategory: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    rating: 4.8,
    numReviews: 33,
    featured: true,
    isBestSeller: true,
    isTrending: false,
    isNewArrival: false,
    tags: ['duffel bag', 'canvas bag', 'leather', 'travel'],
    highlights: ['18oz Heavy water-resistant waxed canvas', 'Separate zippered sneaker compartment', 'Solid forged brass buckles']
  },
  {
    name: 'Solid Sandalwood & Amber Beaded Bracelet',
    description: 'Strung on reinforced elastic core with genuine Mysore aromatic red sandalwood beads and natural baltic amber center stones. Releases a calming woody scent as it warms against the pulse.',
    shortDescription: 'Natural aromatic red sandalwood and polished amber prayer bracelet.',
    price: 799,
    originalPrice: 1199,
    category: 'Accessories',
    subcategory: 'Jewelry',
    images: [
      'https://images.unsplash.com/photo-1611591475819-79b8b73ff2f3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 45,
    rating: 4.5,
    numReviews: 14,
    featured: false,
    isBestSeller: false,
    isTrending: false,
    isNewArrival: true,
    tags: ['bracelet', 'sandalwood', 'amber', 'jewelry'],
    highlights: ['Natural sustainably harvested Mysore sandalwood', 'Triple-reinforced stretch cord', 'Hypoallergenic natural materials']
  },
  {
    name: 'Hand-Stitched Italian Leather Laptop Sleeve',
    description: 'Slimline precision protection for 13-14 inch modern laptops. Crafted from supple cognac brown full-grain leather with soft microfiber velvet interior lining and magnetic invisible flap closure.',
    shortDescription: 'Ultra-slim full-grain leather laptop sleeve with microfiber lining.',
    price: 2199,
    originalPrice: 2999,
    category: 'Accessories',
    subcategory: 'Tech Sleeves',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 22,
    rating: 4.7,
    numReviews: 27,
    featured: false,
    isBestSeller: false,
    isTrending: true,
    isNewArrival: false,
    tags: ['laptop sleeve', 'leather sleeve', 'macbook case', 'accessories'],
    highlights: ['Fits up to 14.2" notebooks', 'Drop-cushioning velvet lining', 'Discreet back pocket for notepad']
  },

  // --- LIFESTYLE ---
  {
    name: 'Artisanal Cold-Pressed Botanical Scented Candle',
    description: 'Poured in small 20-candle batches into reusable amber apothecary jars. 100% natural soy and coconut wax infused with pure cedarwood, wild lavender, and smoked vetiver essential oils. Crackling FSC wood wick.',
    shortDescription: 'Small-batch soy & coconut wax candle with cedarwood & smoked vetiver.',
    price: 899,
    originalPrice: 1299,
    category: 'Lifestyle',
    subcategory: 'Wellness',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 40,
    rating: 4.8,
    numReviews: 34,
    featured: true,
    isBestSeller: true,
    isTrending: false,
    isNewArrival: false,
    tags: ['candle', 'scented candle', 'soy wax', 'wellness'],
    highlights: ['55-Hour clean burn time', 'Zero synthetic paraffin or phthalates', 'FSC-certified crackling wood wick']
  },
  {
    name: 'Pure Copper Handcrafted Ayurveda Water Flask',
    description: 'Hand-spun from 99.8% pure grade food copper with an elegant diamond hammered exterior. Traditional Ayurvedic Tamra Jal vessel that naturally ionizes, alkalizes, and charges your daily drinking water.',
    shortDescription: '950ml hand-hammered pure copper water bottle with leakproof brass cap.',
    price: 1399,
    originalPrice: 1899,
    category: 'Lifestyle',
    subcategory: 'Hydration',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    rating: 4.7,
    numReviews: 29,
    featured: false,
    isBestSeller: true,
    isTrending: true,
    isNewArrival: false,
    tags: ['copper bottle', 'ayurveda', 'water bottle', 'hydration'],
    highlights: ['99.8% Certified pure copper', 'Leakproof silicone sealed brass cap', 'Natural antimicrobial properties']
  },
  {
    name: 'Hand-Bound Recycled Cotton Leather Journal',
    description: 'Bound with supple distressed water buffalo leather and filled with 240 deckle-edged pages made from recycled cotton rag garment cuttings. Free of tree pulp, bleach, and acids — perfectly receptive to fountain pen inks.',
    shortDescription: 'Deckle-edge handmade cotton paper journal with leather tie wrap.',
    price: 1199,
    originalPrice: 1699,
    category: 'Lifestyle',
    subcategory: 'Stationery',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 26,
    rating: 4.9,
    numReviews: 31,
    featured: false,
    isBestSeller: false,
    isTrending: false,
    isNewArrival: true,
    tags: ['journal', 'leather diary', 'deckle edge', 'stationery'],
    highlights: ['240 Pages of 120gsm cotton rag paper', 'Zero fountain pen ink bleed-through', 'Wrap-around leather strap']
  },
  {
    name: 'Natural Stone Himalayan Salt Diffuser Lamp',
    description: 'Carved from 100% authentic pink crystalline mineral salt harvested at the Khewra foothills. Integrated with an ultrasonic essential oil mist aroma diffuser and calming amber mood glow.',
    shortDescription: 'Dual Himalayan crystal salt stone lamp and ultrasonic aroma diffuser.',
    price: 1799,
    originalPrice: 2499,
    category: 'Lifestyle',
    subcategory: 'Wellness',
    images: [
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 21,
    rating: 4.6,
    numReviews: 18,
    featured: false,
    isBestSeller: false,
    isTrending: false,
    isNewArrival: false,
    tags: ['himalayan salt', 'diffuser', 'lamp', 'aromatherapy'],
    highlights: ['Releases negative ions when warm', 'Whisper-quiet ultrasonic mist generator', 'Auto shut-off when water is low']
  },
  {
    name: 'Hand-Carved Neem Wood Grooming Comb Set',
    description: 'A 3-piece grooming collection carved from medicinal Indian Neem wood (Azadirachta indica). Naturally static-free rounded teeth gently massage hair follicles and distribute sebum evenly without hair breakage.',
    shortDescription: 'Anti-static 3-piece medicinal neem wood hair and beard comb kit.',
    price: 499,
    originalPrice: 799,
    category: 'Lifestyle',
    subcategory: 'Grooming',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    rating: 4.8,
    numReviews: 40,
    featured: false,
    isBestSeller: true,
    isTrending: false,
    isNewArrival: false,
    tags: ['neem comb', 'grooming', 'natural care', 'hair care'],
    highlights: ['Natural antibacterial neem properties', '100% Zero plastic and anti-static', 'Includes wide, fine, and pocket tail combs']
  }
];

module.exports = sampleProducts;
