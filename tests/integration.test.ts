/**
 * Integration Tests for Tokenized Kulture
 *
 * Tests all three pillars:
 *  1. AI Video Vault (Arweave metadata)
 *  2. Kulture Wire (origin tracing)
 *  3. Best Video of the Year Contest (voting)
 *
 * Run: npx tsx tests/integration.test.ts
 */

import { ArweaveVault } from '../src/services/arweave-vault.js';
import { KultureWire } from '../src/services/kulture-wire.js';
import { KultureVoteClient } from '../src/services/raffle-client.js';
import { VideoMetadata, ShotMetadata } from '../src/types/video-metadata.js';

// ─── Test Helpers ───────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
    if (condition) {
        console.log(`  ✅ ${testName}`);
        passed++;
    } else {
        console.error(`  ❌ FAILED: ${testName}`);
        failed++;
    }
}

function section(name: string) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  ${name}`);
    console.log(`${'═'.repeat(60)}`);
}

// ─── Test Data ──────────────────────────────────────────────────

function createTestVideoMetadata(): VideoMetadata {
    const shots: ShotMetadata[] = [
        {
            timestamp: '0:00-0:10',
            type: 'Text/Atmosphere',
            visual: 'Golden digital threads forming constellation in dark void',
            cameraMotion: 'Slow Zoom In',
            motionIntensity: 2,
            lighting: 'dramatic backlighting, volumetric fog',
            colorGrade: 'emerald & gold, warm',
            effects: ['film_grain', 'depth_of_field'],
            genPrompt: 'Cinematic title card, "IDENTITY IS THE FIRST ASSET" in gold serif typography...',
            isAiGenerated: true,
            aiEngine: 'Runway Gen-3 Alpha',
        },
        {
            timestamp: '0:10-0:20',
            type: 'UI/Product',
            visual: 'Sleek glass interface displaying MyBlockRoots website',
            cameraMotion: 'Pan Down',
            motionIntensity: 3,
            lighting: 'cinematic lighting, depth of field',
            colorGrade: 'emerald green and gold, dark mode',
            effects: ['depth_of_field', 'lens_flare'],
            genPrompt: 'Close up shot of a sleek glass interface...',
            isAiGenerated: true,
            aiEngine: 'Runway Gen-3 Alpha',
        },
        {
            timestamp: '0:20-0:30',
            type: 'Symbolic/Historical',
            visual: '1870 census document dissolving into digital pixels',
            cameraMotion: 'Static with Internal Motion',
            motionIntensity: 1,
            lighting: 'sepia tone, edge glow',
            colorGrade: 'sepia, warm amber',
            effects: ['slow_motion', 'particle_dissolve'],
            genPrompt: 'Old 1870 handwritten census paper texture...',
            isAiGenerated: true,
            aiEngine: 'Runway Gen-3 Alpha',
        },
    ];

    return {
        title: 'The 1870 Brick Wall — Test Video',
        creator: 'TestWallet123',
        durationSeconds: 213,
        aesthetic: 'Afrofuturist, Cinematic Tech-Noir',
        resolution: '16:9',
        shots,
        aggregate: {
            totalShots: shots.length,
            aiGeneratedPercentage: 100,
            dominantMotion: 'Slow Zoom In',
            dominantMood: 'cinematic_noir',
            uniqueEffects: ['film_grain', 'depth_of_field', 'lens_flare', 'slow_motion', 'particle_dissolve'],
        },
        platform: {
            uploadTimestamp: new Date().toISOString(),
            kulturePoints: 0,
        },
    };
}

// ─── Pillar 1: AI Video Vault Tests ─────────────────────────────

async function testVideoVault() {
    section('PILLAR 1: AI Video Vault (Arweave)');

    const vault = new ArweaveVault();
    const metadata = createTestVideoMetadata();

    // Test 1: Kulture Points computation
    const points = ArweaveVault.computeKulturePoints(metadata);
    assert(points > 0, `Kulture Points computed: ${points} (should be > 0)`);
    assert(points >= 10, `Base points included: ${points} >= 10`);

    // Test 2: Upload metadata (demo mode — no wallet key)
    const txId = await vault.uploadMetadata(metadata);
    assert(typeof txId === 'string', `Upload returned TX ID: ${txId}`);
    assert(txId.length > 0, 'TX ID is non-empty');

    // Test 3: Metadata schema completeness
    assert(metadata.shots.length === 3, `Shot count: ${metadata.shots.length}`);
    assert(metadata.shots.every(s => s.isAiGenerated !== undefined), 'All shots declare AI provenance');
    assert(metadata.shots.every(s => s.lighting.length > 5), 'All shots have lighting descriptions');
    assert(metadata.aggregate.uniqueEffects.length === 5, `Unique effects: ${metadata.aggregate.uniqueEffects.length}`);

    // Test 4: Points reward metadata richness
    const sparseMetadata = { ...metadata, shots: [metadata.shots[0]], aggregate: { ...metadata.aggregate, uniqueEffects: [] } };
    const sparsePoints = ArweaveVault.computeKulturePoints(sparseMetadata);
    assert(points > sparsePoints, `Rich metadata (${points}) earns more than sparse (${sparsePoints})`);
}

// ─── Pillar 2: Kulture Wire Tests ───────────────────────────────

async function testKultureWire() {
    section('PILLAR 2: Kulture Wire (Origin Tracker)');

    const wire = new KultureWire();

    // Test 1: Trace origin (demo mode)
    const report = await wire.traceOrigin('test_tweet_123');
    assert(report !== null, 'Wire report generated');
    assert(report!.strandCount > 0, `Strand count: ${report!.strandCount}`);
    assert(report!.strands.length > 0, `Strands retrieved: ${report!.strands.length}`);
    assert(report!.platform === 'x', `Platform: ${report!.platform}`);

    // Test 2: Cultural tags extraction
    assert(report!.culturalTags.length > 0, `Cultural tags found: ${report!.culturalTags.join(', ')}`);

    // Test 3: Strand engagement data
    const firstStrand = report!.strands[0];
    assert(firstStrand.engagement.likes >= 0, `Strand likes: ${firstStrand.engagement.likes}`);
    assert(firstStrand.engagement.retweets >= 0, `Strand retweets: ${firstStrand.engagement.retweets}`);
    assert(firstStrand.text.length > 0, 'Strand has text content');

    // Test 4: Trending scan (demo mode)
    const reports = await wire.scanTrending();
    assert(reports.length > 0, `Trending scan returned ${reports.length} reports`);
    assert(reports[0].eventTitle.length > 0, `First report title: "${reports[0].eventTitle}"`);
}

// ─── Pillar 3: Best Video of the Year Contest Tests ─────────────

async function testVoteContest() {
    section('PILLAR 3: Best Video of the Year (Vote Contest)');

    const contest = new KultureVoteClient();

    // Test 1: Register videos
    contest.registerVideo('vid_001', 'The 1870 Brick Wall', 'creator_alice', 'arweave_tx_001');
    contest.registerVideo('vid_002', 'Digital Griot Awakening', 'creator_bob', 'arweave_tx_002');
    contest.registerVideo('vid_003', 'The Heritage Protocol', 'creator_carol', 'arweave_tx_003');

    const standings = contest.getStandings();
    assert(standings.entries.length === 3, `Registered ${standings.entries.length} videos`);

    // Test 2: Cast votes
    const receipt1 = await contest.castVote('voter_wallet_1', 'vid_001');
    assert(receipt1 !== null, 'Vote cast successfully');
    assert(receipt1!.costLamports === KultureVoteClient.VOTE_COST_LAMPORTS, `Vote cost: ${receipt1!.costLamports} lamports`);

    await contest.castVote('voter_wallet_1', 'vid_001');
    await contest.castVote('voter_wallet_2', 'vid_001');
    await contest.castVote('voter_wallet_2', 'vid_002');
    await contest.castVote('voter_wallet_3', 'vid_002');
    await contest.castVote('voter_wallet_3', 'vid_003');

    // Test 3: Anti-spam (max 3 votes per wallet per video)
    await contest.castVote('voter_wallet_1', 'vid_001'); // 3rd vote — should work
    const blocked = await contest.castVote('voter_wallet_1', 'vid_001'); // 4th vote — should be blocked
    assert(blocked === null, 'Anti-spam: 4th vote correctly blocked');

    // Test 4: Standings reflect votes
    const updatedStandings = contest.getStandings();
    assert(updatedStandings.totalVotes === 7, `Total votes: ${updatedStandings.totalVotes}`);
    assert(updatedStandings.prizePoolSol > 0, `Prize pool: ${updatedStandings.prizePoolSol} SOL`);
    assert(updatedStandings.voteCostSol === 0.0009, `Vote cost: ${updatedStandings.voteCostSol} SOL`);

    // Test 5: Vote for non-existent video
    const badVote = await contest.castVote('voter_wallet_1', 'vid_nonexistent');
    assert(badVote === null, 'Vote for non-existent video correctly rejected');

    // Test 6: Execute contest
    const result = await contest.executeContest();
    assert(result.winners.length > 0, `Contest produced ${result.winners.length} winners`);
    assert(result.winners[0].rank === 1, 'First place correctly ranked');
    assert(result.winners[0].percentage === 40, `Grand prize: ${result.winners[0].percentage}%`);
    assert(result.prizePoolLamports > 0, `Prize pool: ${result.prizePoolLamports} lamports`);

    // Test 7: Winner is the most-voted video
    assert(result.winners[0].videoId === 'vid_001', `Winner: "${result.winners[0].title}" (most votes)`);
}

// ─── Cross-Pillar Integration Test ──────────────────────────────

async function testIntegration() {
    section('CROSS-PILLAR INTEGRATION');

    const vault = new ArweaveVault();
    const contest = new KultureVoteClient();

    // Upload video → register for contest → vote → verify
    const metadata = createTestVideoMetadata();
    metadata.platform.kulturePoints = ArweaveVault.computeKulturePoints(metadata);

    const txId = await vault.uploadMetadata(metadata);
    assert(txId.length > 0, `Video uploaded to Arweave: ${txId}`);

    contest.registerVideo('int_vid_001', metadata.title, metadata.creator, txId);
    const vote = await contest.castVote('integration_voter', 'int_vid_001');
    assert(vote !== null, 'Voted for uploaded video');

    const standings = contest.getStandings();
    assert(standings.entries[0].arweaveTxId === txId, 'Contest entry linked to Arweave TX');
    assert(standings.prizePoolSol === 0.0009, 'Prize pool reflects one vote');

    console.log('\n  🔗 Full pipeline: Upload → Register → Vote → Verify ✅');
}

// ─── Run All Tests ──────────────────────────────────────────────

async function runAllTests() {
    console.log('\n🧪 TOKENIZED KULTURE — INTEGRATION TEST SUITE');
    console.log(`📅 ${new Date().toISOString()}`);
    console.log('━'.repeat(60));

    try {
        await testVideoVault();
        await testKultureWire();
        await testVoteContest();
        await testIntegration();
    } catch (error) {
        console.error('\n💥 FATAL ERROR:', error);
        failed++;
    }

    console.log('\n' + '━'.repeat(60));
    console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);

    if (failed > 0) {
        console.log('❌ SOME TESTS FAILED');
        process.exit(1);
    } else {
        console.log('✅ ALL TESTS PASSED');
        process.exit(0);
    }
}

runAllTests();
