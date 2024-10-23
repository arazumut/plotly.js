'use strict';

// Projeksiyon isimleri ve d3 fonksiyon isimleri
exports.projNames = {
    airy: 'airy',
    aitoff: 'aitoff',
    'albers usa': 'albersUsa',
    albers: 'albers',
    august: 'august',
    'azimuthal equal area': 'azimuthalEqualArea',
    'azimuthal equidistant': 'azimuthalEquidistant',
    baker: 'baker',
    bertin1953: 'bertin1953',
    boggs: 'boggs',
    bonne: 'bonne',
    bottomley: 'bottomley',
    bromley: 'bromley',
    collignon: 'collignon',
    'conic conformal': 'conicConformal',
    'conic equal area': 'conicEqualArea',
    'conic equidistant': 'conicEquidistant',
    craig: 'craig',
    craster: 'craster',
    'cylindrical equal area': 'cylindricalEqualArea',
    'cylindrical stereographic': 'cylindricalStereographic',
    eckert1: 'eckert1',
    eckert2: 'eckert2',
    eckert3: 'eckert3',
    eckert4: 'eckert4',
    eckert5: 'eckert5',
    eckert6: 'eckert6',
    eisenlohr: 'eisenlohr',
    'equal earth': 'equalEarth',
    equirectangular: 'equirectangular',
    fahey: 'fahey',
    'foucaut sinusoidal': 'foucautSinusoidal',
    foucaut: 'foucaut',
    ginzburg4: 'ginzburg4',
    ginzburg5: 'ginzburg5',
    ginzburg6: 'ginzburg6',
    ginzburg8: 'ginzburg8',
    ginzburg9: 'ginzburg9',
    gnomonic: 'gnomonic',
    'gringorten quincuncial': 'gringortenQuincuncial',
    gringorten: 'gringorten',
    guyou: 'guyou',
    hammer: 'hammer',
    hill: 'hill',
    homolosine: 'homolosine',
    hufnagel: 'hufnagel',
    hyperelliptical: 'hyperelliptical',
    kavrayskiy7: 'kavrayskiy7',
    lagrange: 'lagrange',
    larrivee: 'larrivee',
    laskowski: 'laskowski',
    loximuthal: 'loximuthal',
    mercator: 'mercator',
    miller: 'miller',
    mollweide: 'mollweide',
    'mt flat polar parabolic': 'mtFlatPolarParabolic',
    'mt flat polar quartic': 'mtFlatPolarQuartic',
    'mt flat polar sinusoidal': 'mtFlatPolarSinusoidal',
    'natural earth': 'naturalEarth',
    'natural earth1': 'naturalEarth1',
    'natural earth2': 'naturalEarth2',
    'nell hammer': 'nellHammer',
    nicolosi: 'nicolosi',
    orthographic: 'orthographic',
    patterson: 'patterson',
    'peirce quincuncial': 'peirceQuincuncial',
    polyconic: 'polyconic',
    'rectangular polyconic': 'rectangularPolyconic',
    robinson: 'robinson',
    satellite: 'satellite',
    'sinu mollweide': 'sinuMollweide',
    sinusoidal: 'sinusoidal',
    stereographic: 'stereographic',
    times: 'times',
    'transverse mercator': 'transverseMercator',
    'van der grinten': 'vanDerGrinten',
    'van der grinten2': 'vanDerGrinten2',
    'van der grinten3': 'vanDerGrinten3',
    'van der grinten4': 'vanDerGrinten4',
    wagner4: 'wagner4',
    wagner6: 'wagner6',
    wiechel: 'wiechel',
    'winkel tripel': 'winkel3',
    winkel3: 'winkel3',
};

// Eksen isimleri
exports.axesNames = ['lonaxis', 'lataxis'];

// Maksimum boylam açısal aralığı (DENEYSEL)
exports.lonaxisSpan = {
    orthographic: 180,
    'azimuthal equal area': 360,
    'azimuthal equidistant': 360,
    'conic conformal': 180,
    gnomonic: 160,
    stereographic: 180,
    'transverse mercator': 180,
    '*': 360
};

// Maksimum enlem açısal aralığı (DENEYSEL)
exports.lataxisSpan = {
    'conic conformal': 150,
    stereographic: 179.5,
    '*': 180
};

// Her bir bölge için varsayılan değerler
exports.scopeDefaults = {
    world: {
        lonaxisRange: [-180, 180],
        lataxisRange: [-90, 90],
        projType: 'equirectangular',
        projRotate: [0, 0, 0]
    },
    usa: {
        lonaxisRange: [-180, -50],
        lataxisRange: [15, 80],
        projType: 'albers usa'
    },
    europe: {
        lonaxisRange: [-30, 60],
        lataxisRange: [30, 85],
        projType: 'conic conformal',
        projRotate: [15, 0, 0],
        projParallels: [0, 60]
    },
    asia: {
        lonaxisRange: [22, 160],
        lataxisRange: [-15, 55],
        projType: 'mercator',
        projRotate: [0, 0, 0]
    },
    africa: {
        lonaxisRange: [-30, 60],
        lataxisRange: [-40, 40],
        projType: 'mercator',
        projRotate: [0, 0, 0]
    },
    'north america': {
        lonaxisRange: [-180, -45],
        lataxisRange: [5, 85],
        projType: 'conic conformal',
        projRotate: [-100, 0, 0],
        projParallels: [29.5, 45.5]
    },
    'south america': {
        lonaxisRange: [-100, -30],
        lataxisRange: [-60, 15],
        projType: 'mercator',
        projRotate: [0, 0, 0]
    }
};

// Klip açıları etrafında yuvarlama hatasını önlemek için açısal pad
exports.clipPad = 1e-3;

// Harita projeksiyon hassasiyeti
exports.precision = 0.1;

// Varsayılan kara ve su dolgu renkleri
exports.landColor = '#F0DC82';
exports.waterColor = '#3399FF';

// Konum moduna göre katman ismi
exports.locationmodeToLayer = {
    'ISO-3': 'countries',
    'USA-states': 'subunits',
    'country names': 'countries'
};

// Küre için SVG elemanı (haritaları çerçevelemek için kullanılır)
exports.sphereSVG = {type: 'Sphere'};

// Temel katman isimleri topojson dosyalarındaki isimlerle aynı olmalıdır

// Dolgu rengi olan temel katman
exports.fillLayers = {
    ocean: 1,
    land: 1,
    lakes: 1
};

// Sadece çizgi rengi olan temel katman
exports.lineLayers = {
    subunits: 1,
    countries: 1,
    coastlines: 1,
    rivers: 1,
    frame: 1
};

exports.layers = [
    'bg',
    'ocean', 'land', 'lakes',
    'subunits', 'countries', 'coastlines', 'rivers',
    'lataxis', 'lonaxis', 'frame',
    'backplot',
    'frontplot'
];

exports.layersForChoropleth = [
    'bg',
    'ocean', 'land',
    'subunits', 'countries', 'coastlines',
    'lataxis', 'lonaxis', 'frame',
    'backplot',
    'rivers', 'lakes',
    'frontplot'
];

exports.layerNameToAdjective = {
    ocean: 'ocean',
    land: 'land',
    lakes: 'lake',
    subunits: 'subunit',
    countries: 'country',
    coastlines: 'coastline',
    rivers: 'river',
    frame: 'frame'
};
