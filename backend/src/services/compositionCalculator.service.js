class CompositionCalculator {

    penalty(lineup) {

        const positions = {};

        for (const p of lineup) {
            positions[p.position] =
                (positions[p.position] || 0) + 1;
        }

        let penalty = 0;

        for (const count of Object.values(positions)) {
            if (count >= 4) penalty += 15;
            else if (count === 3) penalty += 8;
        }

        return penalty;
    }
}

module.exports = new CompositionCalculator();