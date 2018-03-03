(function() {
	'use strict';

	const audioPath = 'AudioFiles/';

	const defaultSoundVolume = 0.5;

	const soundsDef = {
		sounds: {
			crash: {
				url: 'crash.wav',
				bars: 4
			},
			openHat: {
				url: 'open_hat.wav',
				bars: 4
			},
			crashOpenHat: {
				url: 'crash_open_hat.wav',
				bars: 4
			},
			crashRide: {
				url: 'crash_ride.wav',
				bars: 4
			},
			// FILLS
			fill1: {
				url: 'fill_1.wav',
				bars: 4,
				groups: ['fills']
			},
			fill2: {
				url: 'fill_2.wav',
				bars: 4,
				groups: ['fills']
			},
			fill3: {
				url: 'fill_3.wav',
				bars: 4,
				groups: ['fills', 'counterpointFills']
			},
			fill4: {
				url: 'fill_4.wav',
				bars: 4,
				groups: ['fills', 'counterpointFills']
			},
			fill5: {
				url: 'fill_5.wav',
				bars: 4,
				groups: ['fills', 'counterpointFills']
			},
			// BREAKDOWN
			downOne: {
				name: 'downOne', // name used in UI
				url: 'full_down_one.wav',
				bars: 1,
				groups: ['breakdown', 'breakdownDownbeats', 'breakdownOneBar', 'breakdownWithHighsOneBar']
			},
			downThree: {
				name: 'downThree',
				url: 'full_down_three.wav',
				bars: 1,
				groups: ['breakdown', 'breakdownDownbeats', 'breakdownOneBar', 'breakdownWithHighsOneBar']
			},
			four: {
				name: 'four',
				url: 'full_four.wav',
				bars: 1,
				groups: ['breakdown', 'breakdownDownbeats', 'breakdownOneBar', 'breakdownWithHighsOneBar']
			},
			upOne: {
				name: 'upOne',
				url: 'full_up_one.wav',
				bars: 1,
				groups: ['breakdown', 'breakdownUpbeats', 'breakdownOneBar', 'breakdownWithHighsOneBar']
			},
			upThree: {
				name: 'upThree',
				url: 'full_up_three.wav',
				bars: 2,
				groups: ['breakdown', 'breakdownUpbeats']
			},
			upThreeDownThree: {
				name: 'upThreeDownThree',
				url: 'full_up_three_down_three.wav',
				bars: 2,
				groups: ['breakdown', 'breakdownUpbeats']
			},
			upThreeFour: {
				name: 'upThreeFour',
				url: 'full_up_three_four.wav',
				bars: 2,
				groups: ['breakdown', 'breakdownUpbeats']
			},
			upThreeUpOne: {
				name: 'upThreeUpOne',
				url: 'full_up_three_up_one.wav',
				bars: 2,
				groups: ['breakdown', 'breakdownUpbeats']
			},
			// HIGHS
			highOneUpOne: {
				url: 'full_high_one_up_one.wav',
				bars: 1,
				groups: ['highs', 'breakdownWithHighsOneBar']
			},
			highTwoUpOne: {
				url: 'full_high_two_up_one.wav',
				bars: 1,
				groups: ['highs', 'breakdownWithHighsOneBar']
			},
			highOneUpThree: {
				url: 'full_high_one_up_three.wav',
				bars: 2,
				groups: ['highs']
			},
			highTwoUpThree: {
				url: 'full_high_two_up_three.wav',
				bars: 2,
				groups: ['highs']
			},
			highOneUpThreeDownThree: {
				url: 'full_high_one_up_three_down_three.wav',
				bars: 2,
				groups: ['highs']
			},
			highTwoUpThreeDownThree: {
				url: 'full_high_two_up_three_down_three.wav',
				bars: 2,
				groups: ['highs']
			},
			highOneUpThreeFour: {
				url: 'full_high_one_up_three_four.wav',
				bars: 2,
				groups: ['highs']
			},
			highTwoUpThreeFour: {
				url: 'full_high_two_up_three_four.wav',
				bars: 2,
				groups: ['highs']
			},
			highOneUpThreeUpOne: {
				url: 'full_high_one_up_three_up_one.wav',
				bars: 2,
				groups: ['highs']
			},
			highTwoUpThreeUpOne: {
				url: 'full_high_two_up_three_up_one.wav',
				bars: 2,
				groups: ['highs']
			},
			highOne: {
				url: 'full_guitar_high_one.wav',
				bars: 1,
				groups: ['highs', 'breakdownWithHighsOneBar']
			},
			highTwo: {
				url: 'full_guitar_high_two.wav',
				bars: 1,
				groups: ['highs', 'breakdownWithHighsOneBar']
			},
			squeal: {
				url: 'full_guitar_squeal.wav',
				bars: 2
			},
			// TREMELO LEFT
			tremeloL0: {
				url: 'tremeloL0.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL1: {
				url: 'tremeloL1.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL2: {
				url: 'tremeloL2.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL3: {
				url: 'tremeloL3.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL4: {
				url: 'tremeloL4.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL5: {
				url: 'tremeloL5.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL6: {
				url: 'tremeloL6.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL7: {
				url: 'tremeloL7.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL8: {
				url: 'tremeloL8.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL9: {
				url: 'tremeloL9.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL10: {
				url: 'tremeloL10.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL11: {
				url: 'tremeloL11.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL12: {
				url: 'tremeloL12.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL13: {
				url: 'tremeloL13.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL14: {
				url: 'tremeloL14.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL15: {
				url: 'tremeloL15.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL16: {
				url: 'tremeloL16.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL17: {
				url: 'tremeloL17.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL18: {
				url: 'tremeloL18.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL19: {
				url: 'tremeloL19.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL20: {
				url: 'tremeloL20.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL21: {
				url: 'tremeloL21.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			// TREMELO RIGHT
			tremeloR0: {
				url: 'tremeloR0.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR1: {
				url: 'tremeloR1.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR2: {
				url: 'tremeloR2.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR3: {
				url: 'tremeloR3.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR4: {
				url: 'tremeloR4.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR5: {
				url: 'tremeloR5.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR6: {
				url: 'tremeloR6.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR6Plus: {
				url: 'tremeloR6+.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR7: {
				url: 'tremeloR7.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR8: {
				url: 'tremeloR8.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR9: {
				url: 'tremeloR9.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR10: {
				url: 'tremeloR10.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR11: {
				url: 'tremeloR11.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR12: {
				url: 'tremeloR12.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR13: {
				url: 'tremeloR13.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR13Plus: {
				url: 'tremeloR13+.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR14: {
				url: 'tremeloR14.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR15: {
				url: 'tremeloR15.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR16: {
				url: 'tremeloR16.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR17: {
				url: 'tremeloR17.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR18: {
				url: 'tremeloR18.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR19: {
				url: 'tremeloR19.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR20: {
				url: 'tremeloR20.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR20Plus: {
				url: 'tremeloR20+.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR21: {
				url: 'tremeloR21.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			// COUNTERPOINT DRUMS
			drumCounterpoint1: {
				url: 'drum_counterpoint_1.wav',
				bars: 4,
				volume: defaultSoundVolume - 0.1,
				groups: ['counterpointDrums']
			},
			drumCounterpoint2: {
				url: 'drum_counterpoint_2.wav',
				bars: 4,
				volume: defaultSoundVolume - 0.1,
				groups: ['counterpointDrums']
			},
			drumCounterpoint3: {
				url: 'drum_counterpoint_3.wav',
				bars: 4,
				volume: defaultSoundVolume - 0.1,
				groups: ['counterpointDrums']
			},
			drumCounterpoint4: {
				url: 'drum_counterpoint_4.wav',
				bars: 4,
				groups: ['counterpointDrums']
			},
			drumSingleNoiseCrash: {
				url: 'drum_single_noise_crash.wav',
				bars: 4
			},
			// HITS LEFT
			hitL0: {
				url: 'hitL0.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL1: {
				url: 'hitL1.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL2: {
				url: 'hitL2.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL3: {
				url: 'hitL3.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL4: {
				url: 'hitL4.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL5: {
				url: 'hitL5.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL6: {
				url: 'hitL6.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL7: {
				url: 'hitL7.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL8: {
				url: 'hitL8.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL9: {
				url: 'hitL9.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL10: {
				url: 'hitL10.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL11: {
				url: 'hitL11.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL12: {
				url: 'hitL12.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL13: {
				url: 'hitL13.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL14: {
				url: 'hitL14.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL15: {
				url: 'hitL15.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL16: {
				url: 'hitL16.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL17: {
				url: 'hitL17.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL18: {
				url: 'hitL18.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL19: {
				url: 'hitL19.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL20: {
				url: 'hitL20.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL21: {
				url: 'hitL21.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL22: {
				url: 'hitL22.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL23: {
				url: 'hitL23.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL24: {
				url: 'hitL24.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL25: {
				url: 'hitL25.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL26: {
				url: 'hitL26.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL27: {
				url: 'hitL27.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL28: {
				url: 'hitL28.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL29: {
				url: 'hitL29.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL30: {
				url: 'hitL30.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL31: {
				url: 'hitL31.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL32: {
				url: 'hitL32.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL33: {
				url: 'hitL33.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL34: {
				url: 'hitL34.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL35: {
				url: 'hitL35.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL36: {
				url: 'hitL36.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			// HITS RIGHT
			hitR0: {
				url: 'hitR0.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR1: {
				url: 'hitR1.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR2: {
				url: 'hitR2.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR3: {
				url: 'hitR3.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR4: {
				url: 'hitR4.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR5: {
				url: 'hitR5.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR6: {
				url: 'hitR6.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR7: {
				url: 'hitR7.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR8: {
				url: 'hitR8.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR9: {
				url: 'hitR9.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR10: {
				url: 'hitR10.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR11: {
				url: 'hitR11.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR12: {
				url: 'hitR12.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR13: {
				url: 'hitR13.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR14: {
				url: 'hitR14.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR15: {
				url: 'hitR15.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR16: {
				url: 'hitR16.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR17: {
				url: 'hitR17.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR18: {
				url: 'hitR18.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR19: {
				url: 'hitR19.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR20: {
				url: 'hitR20.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR21: {
				url: 'hitR21.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR22: {
				url: 'hitR22.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR23: {
				url: 'hitR23.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR24: {
				url: 'hitR24.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR25: {
				url: 'hitR25.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR26: {
				url: 'hitR26.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR27: {
				url: 'hitR27.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR28: {
				url: 'hitR28.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR29: {
				url: 'hitR29.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR30: {
				url: 'hitR30.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR31: {
				url: 'hitR31.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR32: {
				url: 'hitR32.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR33: {
				url: 'hitR33.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR34: {
				url: 'hitR34.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR35: {
				url: 'hitR35.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR36: {
				url: 'hitR36.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			// HITS DRUMS
			hitDrums1: {
				url: 'hit_bridge_1.wav',
				bars: 4,
				groups: ['hitsDrums']
			},
			hitDrums2: {
				url: 'hit_bridge_2.wav',
				bars: 4,
				groups: ['hitsDrums']
			},
			hitDrums3: {
				url: 'hit_bridge_3.wav',
				bars: 4,
				groups: ['hitsDrums']
			},
			hitDrums4: {
				url: 'hit_bridge_4.wav',
				bars: 4,
				groups: ['hitsDrums']
			},
			hitDrums5: {
				url: 'hit_bridge_5.wav',
				bars: 4,
				groups: ['hitsDrums']
			},
			hitDrums6: {
				url: 'hit_bridge_6.wav',
				bars: 4,
				groups: ['hitsDrums']
			}
		}
	};

	// sounds post process: build sound groups, fix audio paths, add volumes if needed.
	soundsDef.soundGroups = {};
	Object.keys(soundsDef.sounds).forEach(function(soundName) {
		const sound = soundsDef.sounds[soundName];
		const groups = sound.groups || [];
		sound.volume = sound.volume === undefined ? defaultSoundVolume : sound.volume;
		sound.url = audioPath + sound.url;
		groups.forEach(function(groupName) {
			let group = soundsDef.soundGroups[groupName];
			if (!group) {
				group = [];
				soundsDef.soundGroups[groupName] = group;
			}
			group.push(sound);
		});
	});

	window.app.soundsDefinition = soundsDef;
})();
