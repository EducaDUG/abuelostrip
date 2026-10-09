/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TripDay, FlightSegment, AbuelosGameState } from '../types';

export interface MarinePhysicsTwin {
  tideHeightMeters: number;
  tidalCurrentKnots: number;
  waveSwellMeters: number;
  waveEnergyFluxKWperM: number; // P = (rho * g^2 / (64 * pi)) * Hs^2 * Te
  waterTemperatureC: number;
  oceanicComfortScore: number; // 0 - 100
}

export interface CircadianTwin {
  circadianPhaseOffsetHours: number;
  jetlagSeverityPct: number; // 0 - 100
  recommendedSleepDurationHours: number;
  peakAlertnessWindow: string;
}

export interface DigitalTwinReport {
  marine: MarinePhysicsTwin;
  circadian: CircadianTwin;
  staminaEstimate: number;
  joyForecast: number;
  luggageTotalKg: number;
  luggageAllowanceKg: number;
  luggageUnderLimit: boolean;
}

/**
 * Calculates real-time marine hydrodynamics and ocean physical equations
 */
export function calculateMarineTwin(
  regionId: string,
  timeOfDayHours: number,
  waveDensityParam: number
): MarinePhysicsTwin {
  // Semi-diurnal M2 tidal period is approx 12.42 hours
  const m2Phase = (timeOfDayHours / 12.42) * Math.PI * 2;
  // Diurnal K1 tidal component
  const k1Phase = (timeOfDayHours / 24.0) * Math.PI * 2;

  // Regional tidal range amplitudes
  const regionalAmplitudeMeters = 
    regionId === 'nz_north' ? 2.8 :
    regionId === 'nz_south' ? 2.2 :
    regionId === 'fiji' ? 1.5 :
    regionId === 'singapore' ? 2.6 :
    regionId === 'azerbaijan' ? 0.4 : // Caspian Sea has micro-tides
    1.2;

  const tideHeightMeters = +(regionalAmplitudeMeters * (0.7 * Math.sin(m2Phase) + 0.3 * Math.sin(k1Phase))).toFixed(2);
  const tidalCurrentKnots = +(Math.abs(Math.cos(m2Phase)) * 2.2 * waveDensityParam).toFixed(2);
  
  // Significant wave height Hs
  const baseSwell = regionId === 'fiji' ? 0.8 : regionId === 'nz_south' ? 1.9 : 1.2;
  const waveSwellMeters = +(baseSwell * waveDensityParam * (0.8 + 0.2 * Math.sin(k1Phase))).toFixed(2);

  // Deepwater wave power density flux equation: P = 0.49 * Hs^2 * Te (kW per meter of wave front)
  const wavePeriodTe = 8.5; // seconds
  const waveEnergyFluxKWperM = +(0.49 * Math.pow(waveSwellMeters, 2) * wavePeriodTe).toFixed(1);

  // Sea surface temperatures
  const waterTemperatureC = 
    regionId === 'fiji' ? 27.5 :
    regionId === 'singapore' ? 29.2 :
    regionId === 'nz_north' ? 18.0 :
    regionId === 'nz_south' ? 13.5 :
    regionId === 'azerbaijan' ? 14.8 :
    19.0;

  const oceanicComfortScore = Math.min(100, Math.max(20, Math.round(95 - (waveSwellMeters * 18))));

  return {
    tideHeightMeters,
    tidalCurrentKnots,
    waveSwellMeters,
    waveEnergyFluxKWperM,
    waterTemperatureC,
    oceanicComfortScore
  };
}

/**
 * Calculates circadian desynchronization and jetlag decay model
 */
export function calculateCircadianTwin(
  currentDay: TripDay,
  originUtcOffset: number = -5 // Houston initial baseline
): CircadianTwin {
  const currentUtcOffset = currentDay.utcOffset;
  const rawOffsetDiff = Math.abs(currentUtcOffset - originUtcOffset);
  const normalizedHourShift = rawOffsetDiff > 12 ? 24 - rawOffsetDiff : rawOffsetDiff;

  // Recovery factor based on days passed (human circadian rhythm resynchronizes ~1 hour per day)
  const recoveryDays = Math.min(currentDay.dayNumber, 12);
  const residualOffset = Math.max(0, normalizedHourShift - recoveryDays * 0.8);
  const jetlagSeverityPct = Math.round(Math.min(100, residualOffset * 10.5));

  const recommendedSleepDurationHours = Math.round(7.5 + (jetlagSeverityPct / 40));

  const peakStart = (9 + Math.round(residualOffset * 0.4)) % 24;
  const peakEnd = (13 + Math.round(residualOffset * 0.4)) % 24;
  const peakAlertnessWindow = `${String(peakStart).padStart(2, '0')}:00 - ${String(peakEnd).padStart(2, '0')}:00`;

  return {
    circadianPhaseOffsetHours: +residualOffset.toFixed(1),
    jetlagSeverityPct,
    recommendedSleepDurationHours,
    peakAlertnessWindow
  };
}

/**
 * Full Digital Twin simulation synthesis
 */
export function simulateDigitalTwin(
  gameState: AbuelosGameState,
  currentDay: TripDay
): DigitalTwinReport {
  const marine = calculateMarineTwin(currentDay.regionId, gameState.timeOfDay, gameState.waveEnergyDensity);
  const circadian = calculateCircadianTwin(currentDay);

  // Luggage physics
  const luggageTotalKg = +gameState.luggageItems
    .filter(i => i.packed)
    .reduce((sum, i) => sum + i.weightKg, 0)
    .toFixed(1);

  const luggageAllowanceKg = currentDay.flight?.luggageLimitKg ?? 23;
  const luggageUnderLimit = luggageTotalKg <= luggageAllowanceKg;

  // Placed sandbox bonuses
  const placedBonuses = gameState.placedSandboxItems
    .filter(item => item.regionId === currentDay.regionId)
    .reduce((acc, item) => ({
      energy: acc.energy + item.bonus.energy,
      joy: acc.joy + item.bonus.joy,
      culture: acc.culture + item.bonus.culture
    }), { energy: 0, joy: 0, culture: 0 });

  const staminaEstimate = Math.min(100, Math.max(10, Math.round(gameState.vitality + placedBonuses.energy * 0.2)));
  const joyForecast = Math.min(100, Math.max(20, Math.round(gameState.joyIndex + placedBonuses.joy * 0.25)));

  return {
    marine,
    circadian,
    staminaEstimate,
    joyForecast,
    luggageTotalKg,
    luggageAllowanceKg,
    luggageUnderLimit
  };
}
