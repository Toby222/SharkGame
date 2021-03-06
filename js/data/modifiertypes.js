SharkGame.ModifierReference = new Map();

// rules to know:
//
// every modifier in this tree must have equivalent depth
// that is that a valid path looks like this: SharkGame.ModifierTypes.category.type.modifier

SharkGame.ModifierTypes = {
    upgrade: {
        multiplier: {
            incomeMultiplier: {
                name: "Income Multiplier",
                defaultValue: 1,
                apply(current, degree, resource, level) {
                    let incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (k, v) => {
                        incomes[k] = v * degree;
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, level) {
                    return r.getResourceName(resource) + " speed x " + degree;
                },
                getEffect(degree, gen, out) {
                    return degree;
                },
            },
            resourceBoost: {
                defaultValue: 1,
                apply(current, degree, resource, level) {
                    let incomes = SharkGame.ResourceMap.get(resource).income;
                    SharkGame.ResourceMap.forEach((v, generator) => {
                        if (v.income) {
                            $.each(v.income, (r, amount) => {
                                if (r === resource) {
                                    if (amount > 0) {
                                        v.income[r] = amount * degree;
                                    }
                                }
                            });
                        }
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, level) {
                    return "All " + r.getResourceName(resource) + " production x " + degree;
                },
                getEffect(degree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 ? degree : 1;
                },
            },
            incomeBoost: {
                defaultValue: 1,
                apply(current, degree, resource, level) {
                    let incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (k, v) => {
                        if (v > 0 && k !== "tar") {
                            incomes[k] = v * degree;
                        }
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, level) {
                    return r.getResourceName(resource) + " efficiency x " + degree;
                },
                getEffect(degree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 && out !== "tar" ? degree : 1;
                },
            },
        },
    },

    world: {
        multiplier: {
            planetaryIncomeMultiplier: {
                defaultValue: 1,
                name: "Planetary Income Multiplier",
                apply(current, degree, resource, level) {
                    let incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (k, v) => {
                        incomes[k] = v * (1 + degree * level);
                    });
                    return current * (1 + degree * level);
                },
                effectDescription(degree, resource, level) {
                    return "Income from " + r.getResourceName(resource, false, false, 2) + " x" + (1 + level * degree).toFixed(2);
                },
                getEffect(degree, gen, out) {
                    return degree;
                },
            },
            planetaryFixedIncomeMultiplier: {
                defaultValue: 1,
                name: "Fixed Planetary Income Multiplier",
                apply(current, degree, resource, level) {
                    let incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (k, v) => {
                        incomes[k] = v * degree;
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, level) {
                    return "Income from " + r.getResourceName(resource, false, false, 2) + " x" + degree;
                },
                getEffect(degree, gen, out) {
                    return degree;
                },
            },
            planetaryIncomeReciprocalMultiplier: {
                defaultValue: 1,
                name: "Planetary Income Reciprocal Multiplier",
                apply(current, degree, resource, level) {
                    let incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (k, v) => {
                        incomes[k] = v * (1 / (1 + level * degree));
                    });
                    return current * (1 / (1 + level * degree));
                },
                effectDescription(degree, resource, level) {
                    return "Income from " + r.getResourceName(resource, false, false, 2) + " x" + (1 / (1 + level * degree)).toFixed(2);
                },
                getEffect(degree, gen, out) {
                    return degree;
                },
            },
            planetaryFixedIncomeReciprocalMultiplier: {
                defaultValue: 1,
                name: "Fixed Planetary Income Reciprocal Multiplier",
                apply(current, degree, resource, level) {
                    let incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (k, v) => {
                        incomes[k] = v * (1 / degree);
                    });
                    return current * (1 / degree);
                },
                effectDescription(degree, resource, level) {
                    return "Income from " + r.getResourceName(resource, false, false, 2) + " x" + (1 / degree).toFixed(2);
                },
                getEffect(degree, gen, out) {
                    return degree;
                },
            },
            planetaryResourceBoost: {
                defaultValue: 1,
                name: "Planetary Boost",
                apply(current, degree, resource, level) {
                    let incomes = SharkGame.ResourceMap.get(resource).income;
                    SharkGame.ResourceMap.forEach((v, generator) => {
                        if (v.income) {
                            $.each(v.income, (r, amount) => {
                                if (r === resource) {
                                    if (amount > 0) {
                                        v.income[r] = amount * (1 + degree * level);
                                    }
                                }
                            });
                        }
                    });
                    return current * (1 + degree * level);
                },
                effectDescription(degree, resource, level) {
                    return "All " + r.getResourceName(resource, false, false, 2) + " x" + (1 + level * degree).toFixed(2);
                },
                getEffect(degree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 ? degree : 1;
                },
            },
            planetaryResourceReciprocalBoost: {
                defaultValue: 1,
                name: "Planetary Reciprocal Boost",
                apply(current, degree, resource, level) {
                    let incomes = SharkGame.ResourceMap.get(resource).income;
                    SharkGame.ResourceMap.forEach((v, generator) => {
                        if (v.income) {
                            $.each(v.income, (r, amount) => {
                                if (r === resource) {
                                    if (amount > 0) {
                                        v.income[r] = amount * (1 / (1 + degree * level));
                                    }
                                }
                            });
                        }
                    });
                    return current * (1 / (1 + degree * level));
                },

                effectDescription(degree, resource, level) {
                    return "All " + r.getResourceName(resource, false, false, 2) + " x" + (1 / (1 + level * degree)).toFixed(2);
                },
                getEffect(degree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 ? degree : 1;
                },
            },
        },
        other: {
            planetaryIncome: {
                defaultValue: 0,
                name: "Income per Climate Level",
                apply(current, degree, resource, level) {
                    w.worldResources.get(resourceName).income = level * degree;
                    return current + level * degree;
                },
                effectDescription(degree, resource, level) {
                    return m.beautify(level * degree) + " " + r.getResourceName(resource, false, false, level * degree) + " per Second";
                },
                getEffect(degree, gen, out) {
                    return 1;
                },
            },
            planetaryConstantIncome: {
                defaultValue: 0,
                name: "Fixed Planetary Income",
                apply(current, degree, resource, level) {
                    w.worldResources.get(resourceName).income = degree;
                    return current + degree;
                },
                effectDescription(degree, resource, level) {
                    return degree + " " + r.getResourceName(resource, false, false, degree) + " per Second";
                },
                getEffect(degree, gen, out) {
                    return 1;
                },
            },
            planetaryStartingResources: {
                defaultValue: 0,
                name: "Planetary Starting Resources",
                apply(current, degree, resource, level) {
                    r.changeResource(resource, level * degree);
                    return current + level * degree;
                },
                effectDescription(degree, resource, level) {
                    return "Start with " + level * degree + " " + r.getResourceName(resource, false, false, level * degree);
                },
                getEffect(degree, gen, out) {
                    return 1;
                },
            },
            planetaryGeneratorRestriction: {
                defaultValue: [],
                name: "Restricted Generator-Income Combination",
                apply(current, restriction, generator, level) {
                    SharkGame.ResourceMap.get(generator).income[restriction] = 0;
                    return current.push(restriction);
                },
                effectDescription(restriction, generator, level) {
                    return r.getResourceName(generator, false, false, 2) + " cannot produce " + r.getResourceName(restriction, false, false, 2);
                },
                getEffect(restriction, gen, out) {
                    return restriction === out ? 0 : 1;
                },
            },
        },
    },
/* 
    artifact: {
        
    }, */
    // do artifacts later when they become actually relevant
}