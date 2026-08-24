import { VehicleTechnicalSpec } from '@/types';

export const VEHICLE_KNOWLEDGE_BASE: VehicleTechnicalSpec[] = [
  // =========================================================================
  // 1. VOLKSWAGEN
  // =========================================================================
  {
    id: 'vw-golf-gti-tsi',
    brand: 'Volkswagen',
    model: 'Golf GTI / GLI 2.0 TSI',
    yearRange: '2015 - 2026',
    engine: '2.0L TSI EA888 Gen3 / Gen4 (230 - 245 HP)',
    vinPrefix: '3VW / WVW',
    oil: {
      viscosity: '5W-40 / 0W-40 VW 502.00 / 504.00',
      capacityLiters: 5.7,
      oemNorm: 'Volkswagen 502 00 / 505 00 / 504 00',
      drainPlugTorqueNm: 30,
      filterTorqueNm: 20,
      recommendedMotul: 'Motul 8100 X-cess Gen2 5W-40 (100% Sintético VW 502 00)',
    },
    sparkPlugs: {
      type: 'NGK Laser Platinum / Iridium High Performance',
      gapInches: '0.032"',
      gapMm: '0.8 mm',
      torqueNm: 28,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'NGK PLFER7A8EG / 06K905601B OEM',
    },
    filters: {
      oilFilterOem: 'VW OEM 06L115562B',
      oilFilterMann: 'Mann Filter HU 6013 z Pro',
      airFilterOem: 'VW OEM 5Q0129620B',
      airFilterMann: 'Mann Filter C 30 005 Pro',
      cabinFilterOem: 'VW OEM 5Q0819653',
      cabinFilterMann: 'Mann Filter FP 26 009 (FreciousPlus Carbón)',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Descarbonizado mariposa sin desmontar potenciómetro. Calibración en Grupo 060 con VCDS / Escáner.',
      injectorNotes: 'Doble inyección MPI + FSI en Gen3. Limpieza presurizada de riel directo.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Con la ignición en OFF, presiona y mantén presionado el botón "0.0/SET" en el cuadro de instrumentos.',
        '2. Gira la ignición a ON (sin encender motor).',
        '3. En la pantalla aparecerá: "¿Desea reiniciar el servicio de cambio de aceite?".',
        '4. Suelta el botón "0.0/SET" y presiona el botón "OK" en el volante para confirmar.',
      ],
      obdProtocol: 'VAG UDS / ISO 15765-4',
    },
    criticalChecklist: [
      'Inspeccionar bomba de agua y termostato plástico (falla común por micro-fugas de anticongelante G12evo/G13).',
      'Revisar válvula PCV (separador de aceite) en tapa de punterías.',
      'Comprobar juego en bujes de horquilla delantera.',
    ],
  },
  {
    id: 'vw-jetta-taos-14t',
    brand: 'Volkswagen',
    model: 'Jetta MK7 / Taos / Virtus 1.4 TSI / 1.5 TSI',
    yearRange: '2019 - 2026',
    engine: '1.4L TSI EA211 Turbo (150 HP / 250 Nm)',
    vinPrefix: '3VW',
    oil: {
      viscosity: '5W-40 / 5W-30 VW 502.00 / 508.00',
      capacityLiters: 4.0,
      oemNorm: 'Volkswagen VW 502 00 / VW 504 00 Oficial',
      drainPlugTorqueNm: 30,
      filterTorqueNm: 20,
      recommendedMotul: 'Motul 8100 X-cess Gen2 5W-40 / Specific 504 00 5W-30',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium / Platinum EA211',
      gapInches: '0.032"',
      gapMm: '0.8 mm',
      torqueNm: 25,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'NGK PZKER7A8DES / 04E905601B OEM',
    },
    filters: {
      oilFilterOem: 'VW OEM 04E115561H',
      oilFilterMann: 'Mann Filter W 712/95 Blindado',
      airFilterOem: 'VW OEM 04E129620',
      airFilterMann: 'Mann Filter C 27 009',
      cabinFilterOem: 'VW OEM 5Q0819653',
      cabinFilterMann: 'Mann Filter FP 26 009',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo de aceleración y sensor MAP integrado en múltiple.',
      injectorNotes: 'Inyección directa TSI 200 bar. Tratamiento con aditivo Motul Valve & Injector Cleaner.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Mantén presionado botón "0.0/SET" con ignición apagada.',
        '2. Enciende el switch y confirma en pantalla con el botón OK del volante multifunción.',
      ],
      obdProtocol: 'VAG CAN UDS',
    },
    criticalChecklist: [
      'Verificar apriete de tapa de filtro de aceite metálico blindado (20 Nm + 1/4 vuelta).',
      'Inspeccionar nivel de refrigerante G12evo rosa.',
    ],
  },
  {
    id: 'vw-vento-polo-16',
    brand: 'Volkswagen',
    model: 'Vento / Polo / Gol / Saveiro 1.6L MSI',
    yearRange: '2014 - 2024',
    engine: '1.6L 4 Cilindros EA111 / EA211 MSI (105 HP)',
    vinPrefix: '3VW / 9BW / MEX',
    oil: {
      viscosity: '5W-40 / 5W-30 VW 502.00',
      capacityLiters: 3.8,
      oemNorm: 'VW 502 00 / 505 00',
      drainPlugTorqueNm: 30,
      filterTorqueNm: 20,
      recommendedMotul: 'Motul 8100 X-cess Gen2 5W-40',
    },
    sparkPlugs: {
      type: 'NGK Cobre / Iridium 3 Electrodos OEM',
      gapInches: '0.035"',
      gapMm: '0.9 mm',
      torqueNm: 25,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'NGK ZFR6T-11G / 101905601F',
    },
    filters: {
      oilFilterOem: 'VW OEM 030115561AN',
      oilFilterMann: 'Mann Filter W 712/52',
      airFilterOem: 'VW OEM 036129620J',
      airFilterMann: 'Mann Filter C 3880',
      cabinFilterOem: 'VW OEM 6R0820367',
      cabinFilterMann: 'Mann Filter CU 26 010',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo de mariposa y adaptación de canal 060 con escáner.',
      injectorNotes: 'Inyección multipunto MPFI. Lavado por tina ultrasónica o boya.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Con ignición apagada, mantén presionado el botón derecho del odómetro.',
        '2. Enciende el switch y gira la perilla del reloj hacia la derecha para resetear.',
      ],
      obdProtocol: 'K-Line / CAN ISO 9141',
    },
    criticalChecklist: [
      'Inspección de banda de tiempo / distribución (cambio a los 60,000 km o 4 años).',
      'Revisar manguera de respiradero de cárter (PCV) propensa a cuartearse.',
    ],
  },
  {
    id: 'vw-jetta-25',
    brand: 'Volkswagen',
    model: 'Jetta MK6 / Beetle / Passat 2.5L (5 Cilindros)',
    yearRange: '2011 - 2018',
    engine: '2.5L 5 Cilindros DOHC 20V (170 HP)',
    vinPrefix: '3VW',
    oil: {
      viscosity: '5W-40 Full Synthetic VW 502.00',
      capacityLiters: 6.0,
      oemNorm: 'VW 502 00 / 505 00',
      drainPlugTorqueNm: 30,
      filterTorqueNm: 25,
      recommendedMotul: 'Motul 8100 X-cess 5W-40',
    },
    sparkPlugs: {
      type: 'NGK Laser Platinum 5 Cilindros',
      gapInches: '0.040"',
      gapMm: '1.0 mm',
      torqueNm: 28,
      hexSize: '16 mm',
      quantity: 5,
      ngkReference: 'NGK PZFR5Q-11 / 101905626 OEM',
    },
    filters: {
      oilFilterOem: 'VW OEM 06D115562',
      oilFilterMann: 'Mann Filter HU 719/7 x',
      airFilterOem: 'VW OEM 07K129620',
      airFilterMann: 'Mann Filter C 14 130',
      cabinFilterOem: 'VW OEM 1K1819653B',
      cabinFilterMann: 'Mann Filter CUK 2939',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de garganta y sensor MAF de 5 cilindros.',
      injectorNotes: 'Inyección multipunto 5 inyectores independientes.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Mantén presionado botón "0.0/SET" con ignición apagada.',
        '2. Enciende el switch y presiona el botón izquierdo de minutos/reloj.',
      ],
      obdProtocol: 'VAG CAN',
    },
    criticalChecklist: [
      'Inspección del diafragma de la válvula reguladora de presión de cárter (tapa de punterías).',
      'Revisar bomba de vacío mecánica para frenos.',
    ],
  },
  {
    id: 'vw-tcross-nivus-10t',
    brand: 'Volkswagen',
    model: 'T-Cross / Nivus / Virtus 1.0 TSI (3 Cilindros)',
    yearRange: '2020 - 2026',
    engine: '1.0L Turbo TSI 3 Cilindros (114 HP / 200 Nm)',
    vinPrefix: '9BW / 3VW',
    oil: {
      viscosity: '5W-40 / 0W-20 VW 508.00 / 502.00',
      capacityLiters: 4.0,
      oemNorm: 'VW 508 00 / 502 00',
      drainPlugTorqueNm: 30,
      filterTorqueNm: 20,
      recommendedMotul: 'Motul 8100 X-cess Gen2 5W-40 / Specific 508 00 0W-20',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium 3 Cilindros Turbo',
      gapInches: '0.032"',
      gapMm: '0.8 mm',
      torqueNm: 25,
      hexSize: '16 mm',
      quantity: 3,
      ngkReference: 'NGK PKER7A8DES / 04C905606A',
    },
    filters: {
      oilFilterOem: 'VW OEM 04E115561H',
      oilFilterMann: 'Mann Filter W 712/95',
      airFilterOem: 'VW OEM 04C129620A',
      airFilterMann: 'Mann Filter C 28 043',
      cabinFilterOem: 'VW OEM 2Q0819653',
      cabinFilterMann: 'Mann Filter FP 26 009',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de mariposa y sensores MAP 1 y MAP 2.',
      injectorNotes: 'Inyección directa TSI 250 bar.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. En la pantalla táctil VW Play, entra a "Ajustes del Vehículo" -> "Servicio".',
        '2. Selecciona "Restablecer Servicio de Cambio de Aceite".',
      ],
      obdProtocol: 'VAG CAN-Bus UDS',
    },
    criticalChecklist: [
      'Revisar correa de distribución dentada libre de aceite.',
      'Comprobar nivel de refrigerante en depósito de expansión con sobrepresión.',
    ],
  },

  // =========================================================================
  // 2. SEAT
  // =========================================================================
  {
    id: 'seat-ibiza-arona-16',
    brand: 'Seat',
    model: 'Ibiza / Arona / Toledo 1.6L MPI & 1.0 TSI',
    yearRange: '2016 - 2026',
    engine: '1.6L 4 Cilindros MSI (110 HP) / 1.0L TSI (115 HP)',
    vinPrefix: 'VSS',
    oil: {
      viscosity: '5W-40 / 5W-30 VW 502.00',
      capacityLiters: 4.0,
      oemNorm: 'VW 502 00 / 504 00',
      drainPlugTorqueNm: 30,
      filterTorqueNm: 20,
      recommendedMotul: 'Motul 8100 X-cess Gen2 5W-40',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium VAG',
      gapInches: '0.035"',
      gapMm: '0.9 mm',
      torqueNm: 25,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'NGK PZKER7A8DES / 04E905601B',
    },
    filters: {
      oilFilterOem: 'Seat OEM 04E115561H',
      oilFilterMann: 'Mann Filter W 712/95',
      airFilterOem: 'Seat OEM 04E129620',
      airFilterMann: 'Mann Filter C 27 009',
      cabinFilterOem: 'Seat OEM 2Q0819653',
      cabinFilterMann: 'Mann Filter FP 26 009',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza con spray descarbonizante sin desmontar cableado.',
      injectorNotes: 'Lavado presurizado de riel de inyectores.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Mantén presionado botón "0.0" del tablero con switch apagado.',
        '2. Enciende el switch y confirma en el menú de la pantalla central.',
      ],
      obdProtocol: 'VAG UDS',
    },
    criticalChecklist: [
      'Inspección de banda de accesorios y tensor dinámico.',
      'Verificar arandela de cobre en tapón de cárter.',
    ],
  },
  {
    id: 'seat-leon-ateca-cupra',
    brand: 'Seat',
    model: 'León / Ateca / Cupra 1.4 TSI & 2.0 TSI Cupra',
    yearRange: '2015 - 2026',
    engine: '1.4 TSI (150 HP) / 2.0 TSI Cupra (290 - 300 HP)',
    vinPrefix: 'VSS',
    oil: {
      viscosity: '5W-40 / 5W-30 VW 502.00 / 504.00',
      capacityLiters: 5.7,
      oemNorm: 'VW 502 00 / 504 00 / 508 00',
      drainPlugTorqueNm: 30,
      filterTorqueNm: 20,
      recommendedMotul: 'Motul 8100 X-cess Gen2 5W-40 / 300V Power',
    },
    sparkPlugs: {
      type: 'NGK Racing / Laser Iridium Grado 8',
      gapInches: '0.028"',
      gapMm: '0.7 mm',
      torqueNm: 28,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'NGK PLFER7A8EG / R7437-8',
    },
    filters: {
      oilFilterOem: 'Seat OEM 06L115562B',
      oilFilterMann: 'Mann Filter HU 6013 z',
      airFilterOem: 'Seat OEM 5Q0129620B',
      airFilterMann: 'Mann Filter C 30 005 Pro',
      cabinFilterOem: 'Seat OEM 5Q0819653',
      cabinFilterMann: 'Mann Filter FP 26 009',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Descarbonizado ultrasónico de cuerpo y colector.',
      injectorNotes: 'Inyección directa FSI 200 bar.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Entra a "Ajustes del Coche" en la pantalla Seat Easy Connect.',
        '2. Selecciona "Servicio y Mantenimiento" -> "Resetear Cambio de Aceite".',
      ],
      obdProtocol: 'VAG UDS',
    },
    criticalChecklist: [
      'Inspección de bomba de refrigerante secundaria del turbo.',
      'Revisar soportes de motor de alto par Cupra.',
    ],
  },

  // =========================================================================
  // 3. SUZUKI
  // =========================================================================
  {
    id: 'suzuki-swift-boosterjet',
    brand: 'Suzuki',
    model: 'Swift Sport / Boosterjet',
    yearRange: '2018 - 2026',
    engine: '1.4L Turbo K14C / K14D Boosterjet (138 HP)',
    vinPrefix: 'JSAAZC',
    oil: {
      viscosity: '5W-30 Full Synthetic (API SP / ILSAC GF-6A)',
      capacityLiters: 3.5,
      oemNorm: 'Suzuki OEM ECSTAR F9000 5W-30 / API SP',
      drainPlugTorqueNm: 35,
      filterTorqueNm: 14,
      recommendedMotul: 'Motul 8100 Eco-lite 5W-30 (100% Sintético)',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium (Calibración Turbo)',
      gapInches: '0.032"',
      gapMm: '0.8 mm',
      torqueNm: 22,
      hexSize: '16 mm (Hexagonal fino)',
      quantity: 4,
      ngkReference: 'NGK ILZKR7D8 / SILZKR7C11S',
    },
    filters: {
      oilFilterOem: 'Suzuki 16510-81403 / 16510-81420',
      oilFilterMann: 'Mann Filter W 68/3 Pro',
      airFilterOem: 'Suzuki 13780-68R00',
      airFilterMann: 'Mann Filter C 24 054',
      cabinFilterOem: 'Suzuki 95860-68P00',
      cabinFilterMann: 'Mann Filter CU 22 023 / FreciousPlus',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza con solvente dieléctrico sin forzar el motor paso a paso. Aprendizaje automático tras 3 ciclos de ignición.',
      injectorNotes: 'Inyección directa Boosterjet: Usar limpiador presurizado de riel de alta presión. No usar aditivos corrosivos con etanol alto.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Con la ignición en OFF, presiona y mantén presionado el botón derecho del odómetro en el cuadro de instrumentos.',
        '2. Gira la llave a posición ON (sin arrancar el motor) manteniendo el botón presionado.',
        '3. El testigo de la llave inglesa o "OIL" parpadeará durante 5 segundos y se escuchará un pitido.',
        '4. Suelta el botón y apaga la ignición. El ciclo de 10,000 km queda reestablecido.',
      ],
      obdProtocol: 'Suzuki OBD-II / CAN-Bus ISO 15765-4',
    },
    criticalChecklist: [
      'Inspeccionar manguera de vacío del solenoide de la válvula Wastegate del Turbo.',
      'Revisar apriete de abrazaderas del intercooler frontal.',
      'Verificar nivel y color del anticongelante orgánico Suzuki Blue Long-Life (G12+).',
    ],
  },
  {
    id: 'suzuki-jimny',
    brand: 'Suzuki',
    model: 'Jimny Sierra / AllGrip',
    yearRange: '2019 - 2026',
    engine: '1.5L K15B DOHC 16V VVT (102 HP)',
    vinPrefix: 'JSAJB74',
    oil: {
      viscosity: '0W-20 / 5W-30 100% Sintético',
      capacityLiters: 3.6,
      oemNorm: 'Suzuki ECSTAR 0W-20 API SN/SP',
      drainPlugTorqueNm: 35,
      filterTorqueNm: 14,
      recommendedMotul: 'Motul 8100 Eco-lite 0W-20 / 8100 X-cess 5W-30',
    },
    sparkPlugs: {
      type: 'Iridio de Larga Duración OEM',
      gapInches: '0.035"',
      gapMm: '0.9 mm',
      torqueNm: 22,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'NGK KR6A-10 / ILKR6F11',
    },
    filters: {
      oilFilterOem: 'Suzuki 16510-81420',
      oilFilterMann: 'Mann Filter W 68/3',
      airFilterOem: 'Suzuki 13780-77R00',
      airFilterMann: 'Mann Filter C 22 038',
      cabinFilterOem: 'Suzuki 95860-77R00',
      cabinFilterMann: 'Mann Filter CU 21 009',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo electrónico. Reseteo de ralentí manteniendo 2,000 RPM por 2 minutos con motor a 90°C.',
      injectorNotes: 'Inyección multipunto indirecta: Limpieza por tina de ultrasonido recomendada cada 20,000 km.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. En la pantalla central LCD del tablero, navega con la perilla derecha hasta "Settings / Configuración".',
        '2. Selecciona "Oil Change Interval / Intervalo de Aceite".',
        '3. Mantén presionado por 3 segundos para resetear a 10,000 KM.',
      ],
      obdProtocol: 'ISO 15765-4 CAN',
    },
    criticalChecklist: [
      'Inspeccionar respiraderos de diferenciales 4x4 y caja de transferencia.',
      'Revisar juego de crucetas en barra cardán.',
      'Inspección de banda de accesorios poli-V.',
    ],
  },
  {
    id: 'suzuki-vitara-boosterjet',
    brand: 'Suzuki',
    model: 'Vitara Boosterjet Turbo / AllGrip',
    yearRange: '2016 - 2026',
    engine: '1.4L Turbo K14C Boosterjet (138 HP / 220 Nm)',
    vinPrefix: 'TSMYE',
    oil: {
      viscosity: '5W-30 Full Synthetic API SP / ILSAC GF-6A',
      capacityLiters: 3.5,
      oemNorm: 'Suzuki ECSTAR F9000 5W-30 API SP',
      drainPlugTorqueNm: 35,
      filterTorqueNm: 14,
      recommendedMotul: 'Motul 8100 Eco-lite 5W-30 (100% Sintético)',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium Turbo',
      gapInches: '0.032"',
      gapMm: '0.8 mm',
      torqueNm: 22,
      hexSize: '16 mm Bi-Hex Fino',
      quantity: 4,
      ngkReference: 'NGK SILZKR7C11S / 09482-00647 OEM',
    },
    filters: {
      oilFilterOem: 'Suzuki 16510-81420',
      oilFilterMann: 'Mann Filter W 68/3 Pro',
      airFilterOem: 'Suzuki 13780-68M00',
      airFilterMann: 'Mann Filter C 24 054',
      cabinFilterOem: 'Suzuki 95860-61M00',
      cabinFilterMann: 'Mann Filter CU 22 023 / FreciousPlus',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de mariposa electrónica sin forzar el engranaje. Auto-calibración al dar 3 ciclos de ignición sin acelerar.',
      injectorNotes: 'Inyección directa alta presión Boosterjet. Limpieza presurizada en riel común.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Con ignición en OFF, mantén presionado el botón derecho del odómetro en el tablero.',
        '2. Gira el switch a posición ON (sin encender el motor) manteniendo el botón presionado.',
        '3. El símbolo de la llave inglesa o aviso "OIL" destellará y emitirá un pitido de confirmación.',
        '4. Suelta el botón y apaga el switch. El intervalo de 10,000 km queda programado.',
      ],
      obdProtocol: 'Suzuki CAN-Bus ISO 15765-4',
    },
    criticalChecklist: [
      'Inspeccionar tuberías de lubricación y refrigeración del turbo.',
      'En versiones AllGrip 4x4: revisar respiradero y nivel de diferencial trasero y caja de transferencia.',
      'Comprobar apriete del tapón de cárter con arandela de aluminio nueva.',
    ],
  },
  {
    id: 'suzuki-grand-vitara-16',
    brand: 'Suzuki',
    model: 'Vitara 1.6L / Grand Vitara Boostergreen Híbrido',
    yearRange: '2015 - 2026',
    engine: '1.6L M16A VVT (118 HP) / 1.5L DualJet Boostergreen',
    vinPrefix: 'TSM / JSA',
    oil: {
      viscosity: '0W-20 / 5W-30 API SP',
      capacityLiters: 3.9,
      oemNorm: 'Suzuki ECSTAR 0W-20 / 5W-30',
      drainPlugTorqueNm: 35,
      filterTorqueNm: 14,
      recommendedMotul: 'Motul 8100 Eco-lite 0W-20 / 5W-30',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium LongLife',
      gapInches: '0.044"',
      gapMm: '1.1 mm',
      torqueNm: 22,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'NGK IFR6J11 / 09482-00549 OEM',
    },
    filters: {
      oilFilterOem: 'Suzuki 16510-61A31',
      oilFilterMann: 'Mann Filter W 68/3',
      airFilterOem: 'Suzuki 13780-61M00',
      airFilterMann: 'Mann Filter C 24 026',
      cabinFilterOem: 'Suzuki 95860-61M00',
      cabinFilterMann: 'Mann Filter CU 22 023',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de garganta y sensor MAF.',
      injectorNotes: 'Limpieza ultrasónica de inyectores multipunto.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Pantalla del tablero -> Menú "Settings" con la perilla derecha -> "Oil Change" -> Mantener presionado 3 segundos.',
      ],
      obdProtocol: 'ISO 15765-4',
    },
    criticalChecklist: [
      'Inspección de banda de accesorios poli-V y tensor.',
      'Revisar nivel de refrigerante Suzuki Long-Life Blue.',
    ],
  },
  {
    id: 'suzuki-ertiga-ignis',
    brand: 'Suzuki',
    model: 'Ertiga / XL7 / Ignis 1.2L & 1.5L',
    yearRange: '2017 - 2026',
    engine: '1.5L K15B / 1.2L K12M VVT (82 - 103 HP)',
    vinPrefix: 'MHM / JSA',
    oil: {
      viscosity: '0W-20 / 5W-30 API SP',
      capacityLiters: 3.6,
      oemNorm: 'Suzuki ECSTAR 0W-20 / 5W-30',
      drainPlugTorqueNm: 35,
      filterTorqueNm: 14,
      recommendedMotul: 'Motul 8100 Eco-lite 0W-20 / 5W-30',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium VVT',
      gapInches: '0.040"',
      gapMm: '1.0 mm',
      torqueNm: 22,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'NGK KR6A-10 / SILZKR7C11S',
    },
    filters: {
      oilFilterOem: 'Suzuki 16510-61A31',
      oilFilterMann: 'Mann Filter W 68/3',
      airFilterOem: 'Suzuki 13780-73R00',
      airFilterMann: 'Mann Filter C 24 026',
      cabinFilterOem: 'Suzuki 95860-73R00',
      cabinFilterMann: 'Mann Filter CU 22 023',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo de aceleración y sensor MAF.',
      injectorNotes: 'Limpieza por tina ultrasónica o boya presurizada.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Gira el contacto a ON manteniendo la perilla derecha del odómetro.',
        '2. Espera el destello del testigo de aceite y confirma.',
      ],
      obdProtocol: 'ISO 15765-4',
    },
    criticalChecklist: [
      'Inspección de banda de accesorios y compresor de A/C.',
      'Revisar nivel de líquido de frenos DOT 4.',
    ],
  },

  // =========================================================================
  // 4. RENAULT
  // =========================================================================
  {
    id: 'renault-duster-13t',
    brand: 'Renault',
    model: 'Duster Turbo / Oroch Turbo',
    yearRange: '2020 - 2026',
    engine: '1.3L Turbo TCe H5Ht (154 HP / 250 Nm)',
    vinPrefix: '93Y',
    oil: {
      viscosity: '5W-30 / 5W-40 RN17 / RN0710',
      capacityLiters: 4.8,
      oemNorm: 'Renault RN17 / RN0700 / RN0710 Oficial',
      drainPlugTorqueNm: 25,
      filterTorqueNm: 15,
      recommendedMotul: 'Motul Specific 17 5W-30 (Norma Oficial Renault)',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium Específica Renault Turbo',
      gapInches: '0.028"',
      gapMm: '0.7 mm',
      torqueNm: 20,
      hexSize: '14 mm Bi-hexagonal',
      quantity: 4,
      ngkReference: 'NGK ILKAR7J7G / 224019185R OEM',
    },
    filters: {
      oilFilterOem: 'Renault 152085758R / 152089599R',
      oilFilterMann: 'Mann Filter W 7032 / HU 6013 z',
      airFilterOem: 'Renault 165467674R',
      airFilterMann: 'Mann Filter C 27 030',
      cabinFilterOem: 'Renault 272773277R',
      cabinFilterMann: 'Mann Filter CU 22 011',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo motorizado. Calibración con escáner OBD-II Renault Clip / Launch.',
      injectorNotes: 'Inyección directa alta presión 250 bar. Usar descarbonizador sintético no abrasivo.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Conducir la pantalla de la computadora de viaje con los botones del volante hasta la pantalla "Autonomía de revisión / Service".',
        '2. Mantén presionado el botón OK del volante durante 10 segundos hasta que el kilometraje empiece a parpadear.',
        '3. Cuando el contador se fije en 10,000 km / 12 meses, suelta el botón OK.',
      ],
      obdProtocol: 'Renault CAN-Bus UDS',
    },
    criticalChecklist: [
      'Inspección del retén de cigüeñal y junta de tapa de punterías.',
      'Revisar mangueras de refrigeración del turbo.',
      'Verificar arandela de cobre de 8mm del tapón de cárter con cuadradillo especial Renault.',
    ],
  },
  {
    id: 'renault-kwid',
    brand: 'Renault',
    model: 'Kwid 1.0L SCe',
    yearRange: '2019 - 2026',
    engine: '1.0L 3 Cilindros B4D SCe (66 HP)',
    vinPrefix: '93YK',
    oil: {
      viscosity: '5W-30 / 10W-40 RN0700',
      capacityLiters: 3.0,
      oemNorm: 'Renault RN0700 / API SP',
      drainPlugTorqueNm: 22,
      filterTorqueNm: 12,
      recommendedMotul: 'Motul 8100 X-cess Gen2 5W-40 / 8100 Eco-lite 5W-30',
    },
    sparkPlugs: {
      type: 'NGK Níquel / Platino 3 Cilindros',
      gapInches: '0.035"',
      gapMm: '0.9 mm',
      torqueNm: 20,
      hexSize: '16 mm',
      quantity: 3,
      ngkReference: 'NGK LZKAR7A / 224018744R',
    },
    filters: {
      oilFilterOem: 'Renault 152085488R',
      oilFilterMann: 'Mann Filter W 66',
      airFilterOem: 'Renault 165463998R',
      airFilterMann: 'Mann Filter C 18 014',
      cabinFilterOem: 'Renault 272773974R',
      cabinFilterMann: 'Mann Filter CU 18 004',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza sin desmontar. Auto-aprendizaje de mariposa al dar contacto por 30 segundos sin pisar pedales.',
      injectorNotes: 'Inyección multipunto 3 inyectores. Lavado por boya presurizada.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Gira la llave a posición de contacto.',
        '2. Presiona el botón del velocímetro hasta la pantalla con la llave de servicio.',
        '3. Mantén presionado por 10 segundos hasta que parpadee y se restablezca.',
      ],
      obdProtocol: 'ISO 15765-4',
    },
    criticalChecklist: [
      'Revisar tensión de la banda elástica de accesorios (sin tensor móvil).',
      'Inspección de soportes de motor de 3 cilindros.',
    ],
  },
  {
    id: 'renault-koleos-duster16',
    brand: 'Renault',
    model: 'Koleos 2.5L / Duster 1.6L / Stepway',
    yearRange: '2015 - 2025',
    engine: '2.5L QR25DE (171 HP) / 1.6L K4M/H4M (115 HP)',
    vinPrefix: '93Y / KN',
    oil: {
      viscosity: '5W-30 / 5W-40 RN0700 / RN0710',
      capacityLiters: 4.6,
      oemNorm: 'Renault RN0700 / RN0710',
      drainPlugTorqueNm: 30,
      filterTorqueNm: 15,
      recommendedMotul: 'Motul 8100 X-cess Gen2 5W-40 / 8100 Eco-lite 5W-30',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium LongLife',
      gapInches: '0.044"',
      gapMm: '1.1 mm',
      torqueNm: 22,
      hexSize: '14 mm / 16 mm',
      quantity: 4,
      ngkReference: 'NGK DILKAR6A11 / BKR6EIX',
    },
    filters: {
      oilFilterOem: 'Renault 15208-65F0E',
      oilFilterMann: 'Mann Filter W 67/1',
      airFilterOem: 'Renault 16546-30P00',
      airFilterMann: 'Mann Filter C 24 012',
      cabinFilterOem: 'Renault 27277-4812R',
      cabinFilterMann: 'Mann Filter CU 1829',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo y auto-aprendizaje de ralentí.',
      injectorNotes: 'Limpieza ultrasónica de inyectores.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Navegar en la pantalla de instrumentos a "Autonomía de revisión".',
        '2. Mantener presionado el botón OK por 10 segundos.',
      ],
      obdProtocol: 'Renault CAN',
    },
    criticalChecklist: [
      'Inspección de retén de polea damper de cigüeñal.',
      'Revisar nivel de anticongelante Glaceol RX Type D amarillo.',
    ],
  },

  // =========================================================================
  // 5. PEUGEOT
  // =========================================================================
  {
    id: 'peugeot-208-2008-puretech',
    brand: 'Peugeot',
    model: '208 / 2008 PureTech Turbo',
    yearRange: '2019 - 2026',
    engine: '1.2L Turbo 3 Cilindros PureTech EB2ADTS (130 HP)',
    vinPrefix: 'VF3',
    oil: {
      viscosity: '0W-20 / 0W-30 PSA B71 2010 / B71 2312 (Estricto)',
      capacityLiters: 3.5,
      oemNorm: 'PSA Peugeot Citroën B71 2010 / B71 2290 Oficial',
      drainPlugTorqueNm: 28,
      filterTorqueNm: 15,
      recommendedMotul: 'Motul Specific 2312 0W-30 / Specific 2010 0W-20',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium Bi-Hex Fina (Alta Eficiencia)',
      gapInches: '0.028"',
      gapMm: '0.7 mm',
      torqueNm: 22,
      hexSize: '14 mm Bi-Hexagonal',
      quantity: 3,
      ngkReference: 'NGK ILZKBR7B8DG / 9807776680 OEM',
    },
    filters: {
      oilFilterOem: 'Peugeot PSA 9818914980 / 1109.AY',
      oilFilterMann: 'Mann Filter HU 7033 z Pro',
      airFilterOem: 'Peugeot PSA 9805552080',
      airFilterMann: 'Mann Filter C 28 038',
      cabinFilterOem: 'Peugeot PSA 9804163480',
      cabinFilterMann: 'Mann Filter FP 29 003-2 (Antialérgico FreciousPlus)',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza por aerosol dieléctrico sin tocar la mariposa con desarmador. Aprendizaje mediante escáner DiagBox o genérico OBD-II.',
      injectorNotes: 'Inyección directa alta presión. Emplear Motul GDI Clean para descarbonizado de válvulas de admisión.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Con el contacto en OFF, presiona y mantén presionado el botón con icono de llave inglesa o "000/SET" en el cuadro de mandos.',
        '2. Pon el contacto (sin pisar freno ni arrancar).',
        '3. Aparecerá una cuenta regresiva de 10 a 0 en la pantalla del tablero.',
        '4. Cuando llegue a "=0" y la llave desaparezca, suelta el botón y apaga el contacto.',
      ],
      obdProtocol: 'PSA CAN-Bus / UDS',
    },
    criticalChecklist: [
      'Inspección visual de la correa de distribución bañada en aceite (Wet Belt) por el tapón de llenado de aceite.',
      'Verificar que el aceite cumpla rigurosamente la norma PSA B71 2010 / 2312 para proteger la correa húmeda.',
      'Inspección de bomba de vacío y decantador de vapores PCV.',
    ],
  },
  {
    id: 'peugeot-3008-5008-thp',
    brand: 'Peugeot',
    model: '3008 / 5008 / Partner / 301 1.6L THP & VTi',
    yearRange: '2016 - 2026',
    engine: '1.6L Turbo THP EP6FDT (165 HP) / 1.6 VTi EC5 (115 HP)',
    vinPrefix: 'VF3',
    oil: {
      viscosity: '5W-30 PSA B71 2297 / B71 2290',
      capacityLiters: 4.25,
      oemNorm: 'PSA Peugeot B71 2290 / B71 2297',
      drainPlugTorqueNm: 30,
      filterTorqueNm: 25,
      recommendedMotul: 'Motul 8100 Eco-clean 5W-30 (C2 / PSA B71 2290)',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium THP Turbo',
      gapInches: '0.030"',
      gapMm: '0.75 mm',
      torqueNm: 24,
      hexSize: '14 mm Bi-Hex',
      quantity: 4,
      ngkReference: 'NGK ILZKBR7A-8G / 5960L5',
    },
    filters: {
      oilFilterOem: 'Peugeot PSA 1109.AH / 9818914980',
      oilFilterMann: 'Mann Filter HU 711/51 x',
      airFilterOem: 'Peugeot PSA 9802888680',
      airFilterMann: 'Mann Filter C 36 013',
      cabinFilterOem: 'Peugeot PSA 9807746380',
      cabinFilterMann: 'Mann Filter FP 29 003-2',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Descarbonizado ultrasónico de cuerpo. Calibración de sensor de presión turbo MAP.',
      injectorNotes: 'Limpieza de inyectores por riel directo con aditivo desincrustante de carbonilla.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Apaga el motor.',
        '2. Presiona el botón del extremo de la palanca de luces o botón "SET" del cuadro.',
        '3. Da contacto y espera el conteo regresivo de 10 segundos.',
      ],
      obdProtocol: 'PSA CAN-Bus',
    },
    criticalChecklist: [
      'Revisar tensión de cadena de distribución THP.',
      'Inspeccionar tubos de engrase y retorno de refrigerante del turbo.',
    ],
  },

  // =========================================================================
  // 6. MAZDA
  // =========================================================================
  {
    id: 'mazda-3-cx5-skyactiv',
    brand: 'Mazda',
    model: 'Mazda 3 / CX-5 / CX-30 / Mazda 2 2.0L - 2.5L',
    yearRange: '2016 - 2026',
    engine: '2.5L / 2.0L / 1.5L Skyactiv-G DOHC (109 - 188 HP)',
    vinPrefix: 'JM1 / JM3 / 3MZ',
    oil: {
      viscosity: '0W-20 / 5W-30 Moly Skyactiv',
      capacityLiters: 4.5,
      oemNorm: 'Mazda Original Oil Supra 0W-20 / API SP GF-6A',
      drainPlugTorqueNm: 38,
      filterTorqueNm: 16,
      recommendedMotul: 'Motul 8100 Eco-lite 0W-20 (Molibdeno Anti-fricción)',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium Skyactiv Alta Compresión (13:1 / 14:1)',
      gapInches: '0.044"',
      gapMm: '1.1 mm',
      torqueNm: 20,
      hexSize: '14 mm',
      quantity: 4,
      ngkReference: 'NGK ILKAR7L11 / PE5R-18-110 OEM',
    },
    filters: {
      oilFilterOem: 'Mazda 1WPE-14-302 / PE01-14-302B',
      oilFilterMann: 'Mann Filter W 67/1 Pro',
      airFilterOem: 'Mazda PE07-13-3A0A',
      airFilterMann: 'Mann Filter C 27 019',
      cabinFilterOem: 'Mazda BDGF-61-J6X',
      cabinFilterMann: 'Mann Filter FP 20 003',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza con solvente especial para cuerpos con recubrimiento de teflón perimetral.',
      injectorNotes: 'Inyección directa multi-orificio 300 bar. Realizar limpieza con boya presurizada.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. En la pantalla táctil central Mazda Connect, entra a "Aplicaciones" o "Información del Vehículo".',
        '2. Selecciona "Monitor de Estado del Vehículo" -> "Mantenimiento".',
        '3. Elige "Restablecer" en Cambio de Aceite y Rotación de Neumáticos.',
        '4. El sistema confirmará el reinicio para los próximos 10,000 KM.',
      ],
      obdProtocol: 'Mazda CAN-Bus OBD-II',
    },
    criticalChecklist: [
      'Inspección del tensor hidráulico de la banda de accesorios (falla conocida de fuga de silicona).',
      'Revisar soporte de motor derecho hidráulico.',
      'Verificar arandela de aluminio original de 14mm del tapón de cárter.',
    ],
  },
  {
    id: 'mazda-cx5-turbo',
    brand: 'Mazda',
    model: 'CX-5 Turbo / Mazda 3 Turbo / CX-50 2.5T',
    yearRange: '2019 - 2026',
    engine: '2.5L Turbo Dynamic Pressure Skyactiv-G (228 HP / 420 Nm)',
    vinPrefix: 'JM3 / 3MZ',
    oil: {
      viscosity: '5W-30 Full Synthetic API SP',
      capacityLiters: 4.8,
      oemNorm: 'Mazda Original Oil 5W-30 API SP',
      drainPlugTorqueNm: 38,
      filterTorqueNm: 16,
      recommendedMotul: 'Motul 8100 Eco-lite 5W-30 / 8100 X-cess Gen2',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium Skyactiv-Turbo',
      gapInches: '0.032"',
      gapMm: '0.8 mm',
      torqueNm: 20,
      hexSize: '14 mm',
      quantity: 4,
      ngkReference: 'NGK DILKAR7M8 / PY8W-18-110',
    },
    filters: {
      oilFilterOem: 'Mazda 1WPE-14-302',
      oilFilterMann: 'Mann Filter W 67/1',
      airFilterOem: 'Mazda PY8W-13-3A0',
      airFilterMann: 'Mann Filter C 27 019',
      cabinFilterOem: 'Mazda BDGF-61-J6X',
      cabinFilterMann: 'Mann Filter FP 20 003',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo electrónico y sensor MAP de sobrealimentación.',
      injectorNotes: 'Inyección directa turbo 300 bar.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. En Mazda Connect: "Ajustes" -> "Vehículo" -> "Mantenimiento" -> "Reset".',
      ],
      obdProtocol: 'Mazda CAN',
    },
    criticalChecklist: [
      'Inspeccionar válvula de descarga de presión dinámica del turbo.',
      'Revisar nivel de refrigerante FL22 verde.',
    ],
  },

  // =========================================================================
  // 7. NISSAN
  // =========================================================================
  {
    id: 'nissan-versa-kicks-march',
    brand: 'Nissan',
    model: 'Versa / Kicks / March / Note 1.6L',
    yearRange: '2015 - 2026',
    engine: '1.6L 4 Cilindros HR16DE (106 - 118 HP)',
    vinPrefix: '3N1',
    oil: {
      viscosity: '5W-30 / 0W-20 API SP',
      capacityLiters: 3.8,
      oemNorm: 'Nissan Genuine Motor Oil API SP',
      drainPlugTorqueNm: 34,
      filterTorqueNm: 15,
      recommendedMotul: 'Motul 8100 Eco-lite 5W-30 / 8100 X-cess 5W-40',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium Rosca Larga',
      gapInches: '0.044"',
      gapMm: '1.1 mm',
      torqueNm: 20,
      hexSize: '14 mm',
      quantity: 4,
      ngkReference: 'NGK DILKAR6A11 / 22401-1KT1B OEM',
    },
    filters: {
      oilFilterOem: 'Nissan 15208-65F0E / 15208-9E01A',
      oilFilterMann: 'Mann Filter W 67/1',
      airFilterOem: 'Nissan 16546-1HK0J',
      airFilterMann: 'Mann Filter C 23 008',
      cabinFilterOem: 'Nissan 27891-3DF0A',
      cabinFilterMann: 'Mann Filter CU 22 007',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de mariposa sin desconectar batería para evitar descalibración de ralentí. Calibración manual: 3 seg ON, 5 aceleraciones en 5 seg, esperar 7 seg, pisar a fondo 10 seg hasta que Check Engine parpadee.',
      injectorNotes: 'Doble inyector por cilindro (Dual Injector System). Limpieza presurizada.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Con los botones del volante, navega a "Ajustes / Settings" en la pantalla del cuadro de instrumentos.',
        '2. Selecciona "Mantenimiento" -> "Aceite y Filtro".',
        '3. Mantén presionado OK para reiniciar la distancia a 10,000 km.',
      ],
      obdProtocol: 'Nissan Consult / ISO 15765-4',
    },
    criticalChecklist: [
      'Revisar arandela de cobre aplastable de cárter (sustituir en cada cambio).',
      'Inspección de banda de accesorios serpenteante y polea loca.',
    ],
  },
  {
    id: 'nissan-sentra-xtrail',
    brand: 'Nissan',
    model: 'Sentra / X-Trail / Altima 2.0L - 2.5L',
    yearRange: '2016 - 2026',
    engine: '2.0L MR20DD (145 HP) / 2.5L QR25DE (170 HP)',
    vinPrefix: '3N1 / JN8',
    oil: {
      viscosity: '0W-20 / 5W-30 API SP GF-6A',
      capacityLiters: 4.6,
      oemNorm: 'Nissan Ester Oil 0W-20 / API SP',
      drainPlugTorqueNm: 34,
      filterTorqueNm: 15,
      recommendedMotul: 'Motul 8100 Eco-lite 0W-20 / 5W-30',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium DILKAR',
      gapInches: '0.044"',
      gapMm: '1.1 mm',
      torqueNm: 20,
      hexSize: '14 mm',
      quantity: 4,
      ngkReference: 'NGK DILKAR7D11H / 22401-ED71B',
    },
    filters: {
      oilFilterOem: 'Nissan 15208-65F0E',
      oilFilterMann: 'Mann Filter W 67/1',
      airFilterOem: 'Nissan 16546-4BA1B',
      airFilterMann: 'Mann Filter C 25 040',
      cabinFilterOem: 'Nissan 27277-4BA0A',
      cabinFilterMann: 'Mann Filter CU 25 003',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo de inyección directa DIG.',
      injectorNotes: 'Limpieza presurizada de riel común de gasolina.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Pantalla del tablero -> Menú "Mantenimiento" -> "Restablecer Aceite".',
      ],
      obdProtocol: 'Nissan CAN',
    },
    criticalChecklist: [
      'Inspección de soportes de transmisión CVT y banda de accesorios.',
    ],
  },
  {
    id: 'nissan-np300-frontier',
    brand: 'Nissan',
    model: 'NP300 / Frontier 2.5L Gasolina & Diésel',
    yearRange: '2016 - 2026',
    engine: '2.5L QR25DE Gasolina (166 HP) / 2.5L YD25 Diésel',
    vinPrefix: '3N6',
    oil: {
      viscosity: '5W-30 / 10W-40 API SP / ACEA C3',
      capacityLiters: 5.1,
      oemNorm: 'Nissan Genuine 5W-30 / API SP',
      drainPlugTorqueNm: 38,
      filterTorqueNm: 18,
      recommendedMotul: 'Motul 8100 X-cess Gen2 5W-40 / 8100 Eco-lite 5W-30',
    },
    sparkPlugs: {
      type: 'NGK Laser Platinum LongLife',
      gapInches: '0.044"',
      gapMm: '1.1 mm',
      torqueNm: 25,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'NGK LFR5A-11 / PLFR5A-11',
    },
    filters: {
      oilFilterOem: 'Nissan 15208-31U0B',
      oilFilterMann: 'Mann Filter W 610/3',
      airFilterOem: 'Nissan 16546-EB70A',
      airFilterMann: 'Mann Filter C 26 014',
      cabinFilterOem: 'Nissan 27891-4KH0A',
      cabinFilterMann: 'Mann Filter CU 24 011',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo de mariposa de trabajo pesado.',
      injectorNotes: 'Limpieza por tina de ultrasonido para servicio de carga.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Pantalla del tablero -> Menú Configuración -> Mantenimiento -> Reset.',
      ],
      obdProtocol: 'ISO 15765-4',
    },
    criticalChecklist: [
      'Inspección de crucetas de cardán y engrasadores.',
      'Revisar nivel de aceite de diferencial trasero.',
    ],
  },

  // =========================================================================
  // 8. TOYOTA
  // =========================================================================
  {
    id: 'toyota-corolla-rav4-camry',
    brand: 'Toyota',
    model: 'Corolla / RAV4 / Camry / Yaris 1.5L - 2.5L Dynamic Force',
    yearRange: '2018 - 2026',
    engine: '1.5L / 2.0L / 2.5L Dynamic Force Dual VVT-iE (105 - 203 HP)',
    vinPrefix: 'JT / 2T / 3TY / 4T',
    oil: {
      viscosity: '0W-20 / 0W-16 Toyota Genuine Motor Oil',
      capacityLiters: 4.5,
      oemNorm: 'Toyota Genuine Motor Oil TGMO 0W-20 API SP',
      drainPlugTorqueNm: 40,
      filterTorqueNm: 25,
      recommendedMotul: 'Motul 8100 Eco-clean 0W-20 / 8100 Eco-lite 0W-20',
    },
    sparkPlugs: {
      type: 'Denso / NGK Iridium Twin-Tip',
      gapInches: '0.040"',
      gapMm: '1.0 mm',
      torqueNm: 22,
      hexSize: '14 mm / 16 mm',
      quantity: 4,
      ngkReference: 'Denso FC20HR8 / NGK ILKAR7B11 / 90919-01275 OEM',
    },
    filters: {
      oilFilterOem: 'Toyota 04152-YZZA6 / 90915-YZZN1',
      oilFilterMann: 'Mann Filter HU 6006 z / W 68/3',
      airFilterOem: 'Toyota 17801-77050 / 17801-0T020',
      airFilterMann: 'Mann Filter C 24 005',
      cabinFilterOem: 'Toyota 87139-YZZ08 / 87139-58010',
      cabinFilterMann: 'Mann Filter FP 19 001 (FreciousPlus)',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo electrónico. Auto-aprendizaje instantáneo al encender con carga de A/C.',
      injectorNotes: 'Sistema D-4S (Inyección directa + indirecta). Descarbonizado de toberas.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Con el botón de odómetro, pon la pantalla en "Trip A".',
        '2. Apaga el vehículo.',
        '3. Mantén presionado el botón de odómetro mientras presionas dos veces el botón START (sin pisar freno).',
        '4. La pantalla mostrará "Restableciendo datos de aceite: -----". Espera que llegue a 000000.',
      ],
      obdProtocol: 'Toyota CAN ISO 15765-4',
    },
    criticalChecklist: [
      'Revisar tórica de goma y tubo central del portafiltro de plástico Toyota.',
      'Inspección de nivel del refrigerante rosa Super Long Life Coolant.',
    ],
  },
  {
    id: 'toyota-hilux-tacoma',
    brand: 'Toyota',
    model: 'Hilux / Tacoma / Avanza 1.5L - 2.7L - 3.5L',
    yearRange: '2016 - 2026',
    engine: '2.7L 2TR-FE (166 HP) / 3.5L V6 2GR-FKS (278 HP)',
    vinPrefix: 'MR0 / 3TM',
    oil: {
      viscosity: '5W-30 / 0W-20 API SP',
      capacityLiters: 5.6,
      oemNorm: 'Toyota TGMO 5W-30 / API SP',
      drainPlugTorqueNm: 40,
      filterTorqueNm: 25,
      recommendedMotul: 'Motul 8100 Eco-lite 5W-30 / 8100 X-cess Gen2',
    },
    sparkPlugs: {
      type: 'Denso Iridium LongLife',
      gapInches: '0.044"',
      gapMm: '1.1 mm',
      torqueNm: 25,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'Denso SK20HR11 / 90919-01191',
    },
    filters: {
      oilFilterOem: 'Toyota 90915-YZZD1 / 04152-YZZA1',
      oilFilterMann: 'Mann Filter W 712/83 / HU 7019 z',
      airFilterOem: 'Toyota 17801-0C010',
      airFilterMann: 'Mann Filter C 31 003',
      cabinFilterOem: 'Toyota 87139-0K010',
      cabinFilterMann: 'Mann Filter CU 1919',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de mariposa y válvula PCV de trabajo pesado.',
      injectorNotes: 'Limpieza por tina ultrasónica de inyectores.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Pantalla del tablero -> Menú Configuración -> Mantenimiento programado -> Restablecer.',
      ],
      obdProtocol: 'Toyota CAN',
    },
    criticalChecklist: [
      'Engrase de flechas y crucetas de transmisión 4x4.',
      'Revisar apriete de tapón de cárter con arandela de fibra Toyota.',
    ],
  },

  // =========================================================================
  // 9. HONDA
  // =========================================================================
  {
    id: 'honda-civic-crv-15t',
    brand: 'Honda',
    model: 'Civic / CR-V / HR-V / Accord 1.5L Turbo Earth Dreams',
    yearRange: '2016 - 2026',
    engine: '1.5L Turbo VTEC L15B7 / L15BA / L15BE (182 - 190 HP)',
    vinPrefix: '19X / 2HG / 3HG',
    oil: {
      viscosity: '0W-20 Full Synthetic HTO-06',
      capacityLiters: 3.8,
      oemNorm: 'Honda Genuine Ultimate Full Synthetic 0W-20 HTO-06',
      drainPlugTorqueNm: 39,
      filterTorqueNm: 14,
      recommendedMotul: 'Motul 8100 Eco-lite 0W-20 (Protección Anti-LSPI Turbo)',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium DILKAR Turbo',
      gapInches: '0.030"',
      gapMm: '0.75 mm',
      torqueNm: 22,
      hexSize: '14 mm',
      quantity: 4,
      ngkReference: 'NGK DILKAR8J9G / 12290-59B-003 OEM',
    },
    filters: {
      oilFilterOem: 'Honda 15400-PLM-A02 / 15400-RTA-003',
      oilFilterMann: 'Mann Filter W 610/6',
      airFilterOem: 'Honda 17220-5AA-A00',
      airFilterMann: 'Mann Filter C 24 040',
      cabinFilterOem: 'Honda 80292-SDA-407',
      cabinFilterMann: 'Mann Filter FP 21 003',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo de aceleración DBW. Reseteo de ECM/PCM con escáner.',
      injectorNotes: 'Inyección directa alta presión. Usar limpiador libre de cenizas para cuidar catalizador.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Pon el vehículo en modo accesorios ON.',
        '2. En el volante, presiona el botón Home/Info hasta el menú "Vida de Aceite / Oil Life %".',
        '3. Mantén presionado el botón Enter o la perilla del odómetro durante 10 segundos hasta que parpadee.',
        '4. Selecciona "Item A" o "Todo" y confirma para restablecer al 100%.',
      ],
      obdProtocol: 'Honda HDS / CAN',
    },
    criticalChecklist: [
      'Inspeccionar nivel de aceite con varilla naranja (revisar que no haya dilución de combustible típica en trayectos cortos).',
      'Comprobar estado del filtro de aire ante saturación prematura.',
    ],
  },
  {
    id: 'honda-city-fit-hrv',
    brand: 'Honda',
    model: 'City / Fit / BR-V / HR-V 1.5L i-VTEC & 1.8L',
    yearRange: '2015 - 2026',
    engine: '1.5L L15B i-VTEC (119 HP) / 1.8L R18Z9 (141 HP)',
    vinPrefix: '3HG / MRH',
    oil: {
      viscosity: '0W-20 / 5W-30 API SP',
      capacityLiters: 3.6,
      oemNorm: 'Honda Genuine Motor Oil 0W-20',
      drainPlugTorqueNm: 39,
      filterTorqueNm: 14,
      recommendedMotul: 'Motul 8100 Eco-lite 0W-20 / 5W-30',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium DILZKAR',
      gapInches: '0.044"',
      gapMm: '1.1 mm',
      torqueNm: 22,
      hexSize: '14 mm',
      quantity: 4,
      ngkReference: 'NGK DILZKAR7C11S / 12290-5R0-003',
    },
    filters: {
      oilFilterOem: 'Honda 15400-PLM-A02',
      oilFilterMann: 'Mann Filter W 610/6',
      airFilterOem: 'Honda 17220-55A-Z01',
      airFilterMann: 'Mann Filter C 21 004',
      cabinFilterOem: 'Honda 80291-TF0-941',
      cabinFilterMann: 'Mann Filter CU 21 003',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de garganta y reaprendizaje de ralentí i-VTEC.',
      injectorNotes: 'Limpieza por tina ultrasónica de inyectores.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Tablero -> Menú Odómetro -> Mantener botón presionado 10 segundos hasta parpadeo -> Presionar 5 segundos para fijar a 100%.',
      ],
      obdProtocol: 'Honda CAN',
    },
    criticalChecklist: [
      'Revisar arandela de aluminio de tapón de cárter de 14mm.',
      'Inspeccionar nivel de líquido de frenos DOT 4.',
    ],
  },

  // =========================================================================
  // 10. FORD
  // =========================================================================
  {
    id: 'ford-escape-bronco-15t',
    brand: 'Ford',
    model: 'Escape / Bronco Sport / Maverick 1.5L & 2.0L EcoBoost',
    yearRange: '2020 - 2026',
    engine: '1.5L 3 Cil. EcoBoost (181 HP) / 2.0L EcoBoost (250 HP)',
    vinPrefix: '3FA / 1FM / 3MA',
    oil: {
      viscosity: '5W-20 / 5W-30 Motorcraft WSS-M2C945-B1',
      capacityLiters: 4.8,
      oemNorm: 'Ford WSS-M2C945-B1 / WSS-M2C946-B1',
      drainPlugTorqueNm: 28,
      filterTorqueNm: 16,
      recommendedMotul: 'Motul 8100 Eco-lite 5W-20 / 5W-30',
    },
    sparkPlugs: {
      type: 'Motorcraft / NGK Iridium EcoBoost Turbo',
      gapInches: '0.030"',
      gapMm: '0.75 mm',
      torqueNm: 20,
      hexSize: '16 mm',
      quantity: 3,
      ngkReference: 'Motorcraft SP-546 / NGK LTR6DI-8',
    },
    filters: {
      oilFilterOem: 'Motorcraft FL-910S',
      oilFilterMann: 'Mann Filter W 7015',
      airFilterOem: 'Ford JX6Z-9601-A',
      airFilterMann: 'Mann Filter C 24 049',
      cabinFilterOem: 'Ford JX6Z-19N619-BA',
      cabinFilterMann: 'Mann Filter FP 24 012',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo de mariposa electrónico EcoBoost.',
      injectorNotes: 'Inyección directa alta presión. Usar limpiador libre de cloro.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Gira la ignición a ON (sin encender motor).',
        '2. Presiona simultáneamente los pedales de ACELERADOR y FRENO hasta el fondo.',
        '3. Mantén ambos pedales presionados durante 20 segundos.',
        '4. En el tablero aparecerá: "Oil Reset Complete". Suelta los pedales y apaga.',
      ],
      obdProtocol: 'Ford CAN-Bus ISO 15765-4',
    },
    criticalChecklist: [
      'Inspeccionar tapón de cárter de plástico amarillo (reemplazar junta tórica en motores 1.5T).',
      'Revisar mangueras de intercooler del turbo.',
    ],
  },
  {
    id: 'ford-focus-fiesta-ranger',
    brand: 'Ford',
    model: 'Focus / Fiesta / Ranger / Explorer 2.0L - 2.5L - 2.3L',
    yearRange: '2014 - 2025',
    engine: '2.0L Duratec GDI (160 HP) / 2.5L Duratec / 2.3L EcoBoost',
    vinPrefix: '1FA / 3FA / 8AF',
    oil: {
      viscosity: '5W-20 / 5W-30 WSS-M2C913-D',
      capacityLiters: 4.5,
      oemNorm: 'Ford WSS-M2C913-D / WSS-M2C948-B',
      drainPlugTorqueNm: 28,
      filterTorqueNm: 16,
      recommendedMotul: 'Motul 8100 Eco-nergy 5W-30 / Eco-lite 5W-20',
    },
    sparkPlugs: {
      type: 'Motorcraft / NGK Laser Iridium',
      gapInches: '0.035"',
      gapMm: '0.9 mm',
      torqueNm: 20,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'Motorcraft SP-530 / NGK LTR6IX-11',
    },
    filters: {
      oilFilterOem: 'Motorcraft FL-910S',
      oilFilterMann: 'Mann Filter W 7015',
      airFilterOem: 'Ford 7S71-9601-A',
      airFilterMann: 'Mann Filter C 16 134',
      cabinFilterOem: 'Ford 1709013',
      cabinFilterMann: 'Mann Filter FP 25 007',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo de mariposa y sensor MAF.',
      injectorNotes: 'Limpieza presurizada de inyectores.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Ignición en ON -> Pisar acelerador y freno por 20 segundos hasta aviso en pantalla.',
      ],
      obdProtocol: 'Ford CAN',
    },
    criticalChecklist: [
      'Inspección de mangueras de refrigerante y depósito desgasificador.',
      'Revisar soportes de motor hidráulicos.',
    ],
  },

  // =========================================================================
  // 11. CHEVROLET
  // =========================================================================
  {
    id: 'chevy-onix-tracker-12t',
    brand: 'Chevrolet',
    model: 'Onix / Tracker / Montana 1.0T & 1.2T Ecotec',
    yearRange: '2020 - 2026',
    engine: '1.0L / 1.2L Turbo 3 Cilindros CSS Prime Ecotec (114 - 130 HP)',
    vinPrefix: '3GY / 9BG',
    oil: {
      viscosity: '0W-20 / 5W-30 Dexos 1 Gen 3 (Estricto)',
      capacityLiters: 4.0,
      oemNorm: 'GM Dexos 1 Gen 3 / Gen 2 Oficial',
      drainPlugTorqueNm: 20,
      filterTorqueNm: 15,
      recommendedMotul: 'Motul 8100 Eco-lite 0W-20 / 5W-30 (Aprobado Dexos 1 Gen 3)',
    },
    sparkPlugs: {
      type: 'ACDelco / NGK Laser Iridium 3 Cilindros Ecotec',
      gapInches: '0.028"',
      gapMm: '0.7 mm',
      torqueNm: 18,
      hexSize: '14 mm Bi-Hex',
      quantity: 3,
      ngkReference: 'ACDelco 12693557 / NGK SILZKFR8D7G',
    },
    filters: {
      oilFilterOem: 'GM ACDelco 25206966 / 12696048',
      oilFilterMann: 'Mann Filter HU 6022 z',
      airFilterOem: 'GM 26233092',
      airFilterMann: 'Mann Filter C 24 048',
      cabinFilterOem: 'GM 26274092',
      cabinFilterMann: 'Mann Filter FP 24 003',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo de mariposa motorizado Ecotec.',
      injectorNotes: 'Inyección directa alta presión 200 bar. Usar aditivo GM Fuel System Treatment.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Pon la ignición en ON (sin arrancar).',
        '2. Con la perilla de la palanca de luces o menú del volante, ve a "Vida útil del aceite restante %".',
        '3. Mantén presionado el botón "SET/CLR" del extremo de la palanca durante 5 segundos.',
        '4. El tablero preguntará: "¿Desea restablecer?". Selecciona Sí y confirma al 100%.',
      ],
      obdProtocol: 'GMLAN / CAN-Bus ISO 15765-4',
    },
    criticalChecklist: [
      'Inspección de la correa de distribución húmeda bañada en aceite (Wet Belt) por el tapón de aceite.',
      'IMPORTANTE: Usar EXCLUSIVAMENTE aceite con aprobación oficial Dexos 1 Gen 3 para no degradar la correa interna.',
      'Revisar válvula PCV integrada en tapa de punterías.',
    ],
  },
  {
    id: 'chevy-aveo-captiva-cavalier',
    brand: 'Chevrolet',
    model: 'Aveo / Captiva / Cavalier / Trax 1.5L & 1.5T',
    yearRange: '2018 - 2026',
    engine: '1.5L DOHC DVVT (107 HP) / 1.5L Turbo DVVT (144 HP)',
    vinPrefix: '3G1 / LSG',
    oil: {
      viscosity: '5W-30 / 5W-40 Dexos 1 Gen 2 / Gen 3',
      capacityLiters: 4.2,
      oemNorm: 'GM Dexos 1 Gen 2 / API SP',
      drainPlugTorqueNm: 25,
      filterTorqueNm: 15,
      recommendedMotul: 'Motul 8100 Eco-lite 5W-30 / 8100 X-cess 5W-40',
    },
    sparkPlugs: {
      type: 'ACDelco Iridium LongLife',
      gapInches: '0.035"',
      gapMm: '0.9 mm',
      torqueNm: 22,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'ACDelco 19375373 / NGK LKAR7C-9',
    },
    filters: {
      oilFilterOem: 'GM 24103565 / 9025229',
      oilFilterMann: 'Mann Filter W 67/1',
      airFilterOem: 'GM 24565780',
      airFilterMann: 'Mann Filter C 24 022',
      cabinFilterOem: 'GM 24565782',
      cabinFilterMann: 'Mann Filter CU 22 018',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo de aceleración y sensor TPS.',
      injectorNotes: 'Limpieza por tina ultrasónica de inyectores.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Gira la llave a posición ON.',
        '2. Presiona a fondo el pedal del acelerador 3 veces seguidas en menos de 5 segundos.',
        '3. La luz de cambio de aceite parpadeará y se apagará.',
      ],
      obdProtocol: 'ISO 15765-4',
    },
    criticalChecklist: [
      'Inspección de banda de tiempo (en motores 1.5L que no usen cadena).',
      'Revisar termostato y mangueras de calefacción.',
    ],
  },
  {
    id: 'chevy-spark-beat',
    brand: 'Chevrolet',
    model: 'Spark / Beat 1.2L S-TEC II',
    yearRange: '2016 - 2022',
    engine: '1.2L 4 Cilindros S-TEC II DOHC (81 HP)',
    vinPrefix: 'KL1 / 3G1',
    oil: {
      viscosity: '5W-30 / 5W-20 Dexos 1',
      capacityLiters: 3.75,
      oemNorm: 'GM Dexos 1 Gen 2 / API SN',
      drainPlugTorqueNm: 25,
      filterTorqueNm: 14,
      recommendedMotul: 'Motul 8100 Eco-lite 5W-30',
    },
    sparkPlugs: {
      type: 'NGK Laser Iridium S-TEC',
      gapInches: '0.040"',
      gapMm: '1.0 mm',
      torqueNm: 20,
      hexSize: '16 mm',
      quantity: 4,
      ngkReference: 'NGK DCPR7EIX / 96464000 OEM',
    },
    filters: {
      oilFilterOem: 'GM 96985730',
      oilFilterMann: 'Mann Filter W 67/1',
      airFilterOem: 'GM 96827723',
      airFilterMann: 'Mann Filter C 23 015',
      cabinFilterOem: 'GM 95981206',
      cabinFilterMann: 'Mann Filter CU 18 003',
    },
    throttleAndInjectors: {
      throttleProcedure: 'Limpieza de cuerpo de aceleración y válvula IAC.',
      injectorNotes: 'Limpieza presurizada de inyectores.',
    },
    serviceReset: {
      dashboardSteps: [
        '1. Gira la llave a ON y presiona el botón "MENU" del cuadro de instrumentos hasta "Restablecer Aceite".',
      ],
      obdProtocol: 'ISO 15765-4',
    },
    criticalChecklist: [
      'Revisar bobina de encendido tipo regleta (revisar aisladores de goma ante fugas de chispa).',
      'Inspección de banda de accesorios.',
    ],
  },
];

/**
 * Busca las especificaciones oficiales en la base de datos por marca, modelo, VIN o palabras clave
 */
export function searchVehicleSpecs(query: string): VehicleTechnicalSpec[] {
  const q = query.toLowerCase().trim();
  if (!q) return VEHICLE_KNOWLEDGE_BASE;

  return VEHICLE_KNOWLEDGE_BASE.filter((spec) => {
    return (
      spec.brand.toLowerCase().includes(q) ||
      spec.model.toLowerCase().includes(q) ||
      spec.engine.toLowerCase().includes(q) ||
      (spec.vinPrefix && spec.vinPrefix.toLowerCase().includes(q))
    );
  });
}

/**
 * Encuentra la especificación más cercana para un vehículo dado
 */
export function findVehicleSpec(
  brand: string,
  model: string,
  vin?: string
): VehicleTechnicalSpec | null {
  const b = brand.toLowerCase().trim();
  const m = model.toLowerCase().trim();

  // 1. Intento por coincidencia de VIN
  if (vin && vin.length >= 3) {
    const byVin = VEHICLE_KNOWLEDGE_BASE.find(
      (s) => s.vinPrefix && vin.toUpperCase().startsWith(s.vinPrefix.toUpperCase())
    );
    if (byVin) return byVin;
  }

  // 2. Intento por Marca y Modelo exacto o parcial
  const exact = VEHICLE_KNOWLEDGE_BASE.find(
    (s) =>
      s.brand.toLowerCase() === b &&
      (m.includes(s.model.toLowerCase()) ||
        s.model.toLowerCase().includes(m) ||
        s.model.toLowerCase().split(' ').some((word) => word.length > 2 && m.includes(word)))
  );
  if (exact) return exact;

  // 3. Intento por Marca únicamente
  const byBrand = VEHICLE_KNOWLEDGE_BASE.find((s) => s.brand.toLowerCase() === b);
  if (byBrand) return byBrand;

  // 4. Default al primer registro
  return VEHICLE_KNOWLEDGE_BASE[0];
}
