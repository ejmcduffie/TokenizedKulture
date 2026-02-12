/**
 * ═══════════════════════════════════════════════════════════════════════
 *  TOKENIZED KULTURE — FUNCTIONAL TEST SUITE
 *  Vision-to-Codebase Alignment Verification
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  Tests every category described in the project vision documents
 *  (README.md, BUILD_SUMMARY.md, TESTING.md) against what actually
 *  exists in the codebase.
 *
 *  Run: npx tsx tests/functional-test.ts
 * ═══════════════════════════════════════════════════════════════════════
 */

import { ArweaveVault } from '../src/services/arweave-vault.js';
import { KultureWire } from '../src/services/kulture-wire.js';
import { KultureVoteClient } from '../src/services/raffle-client.js';
import { VideoMetadata, ShotMetadata, WireReport } from '../src/types/video-metadata.js';

// ─── Test Framework ─────────────────────────────────────────────────

let totalPassed = 0;
let totalFailed = 0;
let currentCategory = '';
let categoryPassed = 0;
let categoryFailed = 0;

function category(name: string) {
    if (currentCategory) {
        console.log(`\n  📊 ${currentCategory}: ${categoryPassed} passed, ${categoryFailed} failed`);
    }
    currentCategory = name;
    categoryPassed = 0;
    categoryFailed = 0;
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`  🧪 ${name}`);
    console.log(`${'═'.repeat(70)}`);
}

function test(name: string, condition: boolean) {
    if (condition) {
        console.log(`    ✅ ${name}`);
        totalPassed++;
        categoryPassed++;
    } else {
        console.error(`    ❌ FAIL: ${name}`);
        totalFailed++;
        categoryFailed++;
    }
}

function info(msg: string) {
    console.log(`    ℹ️  ${msg}`);
}

// ─── Test Data Factory ──────────────────────────────────────────────

function createRichVideoMetadata(): VideoMetadata {
    const shots: ShotMetadata[] = [
        {
            timestamp: '0:00-0:10',
            type: 'Text/Atmosphere',
            visual: 'Golden digital threads forming constellation in dark void',
            cameraMotion: 'Slow Zoom In',
            motionIntensity: 2,
            lighting: 'dramatic backlighting, volumetric fog',
            colorGrade: 'emerald & gold, warm tones',
            effects: ['film_grain', 'depth_of_field'],
            genPrompt: 'Cinematic title card, "IDENTITY IS THE FIRST ASSET" in gold serif typeface...',
            isAiGenerated: true,
            aiEngine: 'Runway Gen-3 Alpha',
        },
        {
            timestamp: '0:10-0:20',
            type: 'UI/Product',
            visual: 'Sleek glass interface displaying MyBlockRoots website',
            cameraMotion: 'Pan Down',
            motionIntensity: 3,
            lighting: 'cinematic lighting, depth of field effect',
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
            lighting: 'sepia tone, edge glow accent',
            colorGrade: 'sepia, warm amber',
            effects: ['slow_motion', 'particle_dissolve'],
            genPrompt: 'Old 1870 handwritten census paper texture...',
            isAiGenerated: true,
            aiEngine: 'Runway Gen-3 Alpha',
        },
        {
            timestamp: '0:30-0:40',
            type: 'Character/Abstract',
            visual: 'Digital avatar walking through a neon-lit alley',
            cameraMotion: 'Truck Right',
            motionIntensity: 4,
            lighting: 'neon sidelight, purple-cyan rim',
            colorGrade: 'cyberpunk neon, high contrast',
            effects: ['chromatic_aberration', 'bloom'],
            genPrompt: 'A cyberpunk character with braids walks down neon alley...',
            isAiGenerated: true,
            aiEngine: 'Veo',
        },
    ];

    return {
        title: 'The 1870 Brick Wall — Functional Test',
        creator: 'FuncTestWallet_ABCD1234',
        durationSeconds: 213,
        aesthetic: 'Afrofuturist, Cinematic Tech-Noir',
        resolution: '16:9',
        shots,
        aggregate: {
            totalShots: shots.length,
            aiGeneratedPercentage: 100,
            dominantMotion: 'Slow Zoom In',
            dominantMood: 'cinematic_noir',
            uniqueEffects: ['film_grain', 'depth_of_field', 'lens_flare', 'slow_motion', 'particle_dissolve', 'chromatic_aberration', 'bloom'],
        },
        platform: {
            uploadTimestamp: new Date().toISOString(),
            kulturePoints: 0,
        },
    };
}

function createSparseVideoMetadata(): VideoMetadata {
    return {
        title: 'Sparse Test Video',
        creator: 'SparseWallet',
        durationSeconds: 10,
        aesthetic: 'minimal',
        resolution: '16:9',
        shots: [{
            timestamp: '0:00-0:10',
            type: 'Text/Atmosphere',
            visual: 'Text on screen',
            cameraMotion: 'Static',
            motionIntensity: 1,
            lighting: 'flat',
            colorGrade: 'gray',
            effects: [],
            genPrompt: '',
            isAiGenerated: false,
        }],
        aggregate: {
            totalShots: 1,
            aiGeneratedPercentage: 0,
            dominantMotion: 'Static',
            dominantMood: 'neutral',
            uniqueEffects: [],
        },
        platform: {
            uploadTimestamp: new Date().toISOString(),
            kulturePoints: 0,
        },
    };
}


// ═══════════════════════════════════════════════════════════════════════
//  CATEGORY 1: AI VIDEO VAULT (Pillar 1) 
//  Vision: Permanent video metadata storage on Arweave via Irys
// ═══════════════════════════════════════════════════════════════════════

async function testCategory1_VideoVault() {
    category('CATEGORY 1: AI VIDEO VAULT (Arweave Permanent Storage)');

    const vault = new ArweaveVault();
    const richMetadata = createRichVideoMetadata();
    const sparseMetadata = createSparseVideoMetadata();

    // 1A: Service instantiation
    test('ArweaveVault service can be instantiated', vault !== null);

    // 1B: Upload returns a valid transaction ID (demo mode)
    const txId = await vault.uploadMetadata(richMetadata);
    test('uploadMetadata returns a string TX ID', typeof txId === 'string');
    test('TX ID is non-empty', txId.length > 0);

    // 1C: Kulture Points — base reward
    const points = ArweaveVault.computeKulturePoints(richMetadata);
    test('Kulture Points are computed (> 0)', points > 0);
    test('Base reward of 10 points included', points >= 10);

    // 1D: Kulture Points — metadata richness rewards more
    const sparsePoints = ArweaveVault.computeKulturePoints(sparseMetadata);
    test(`Rich metadata (${points} pts) > sparse metadata (${sparsePoints} pts)`, points > sparsePoints);
    info(`Difference: +${points - sparsePoints} points for richer metadata`);

    // 1E: Kulture Points — shot count bonus
    const twoShotMeta = { ...richMetadata, shots: richMetadata.shots.slice(0, 2), aggregate: { ...richMetadata.aggregate, totalShots: 2 } };
    const twoShotPoints = ArweaveVault.computeKulturePoints(twoShotMeta);
    test('More shots = more points (4 shots > 2 shots)', points > twoShotPoints);

    // 1F: Kulture Points — AI transparency bonus
    const undeclaredMeta = {
        ...richMetadata,
        shots: richMetadata.shots.map(s => ({ ...s, isAiGenerated: undefined as any })),
    };
    const undeclaredPoints = ArweaveVault.computeKulturePoints(undeclaredMeta);
    test('AI transparency declaration earns bonus points', points > undeclaredPoints);

    // 1G: Kulture Points — effects bonus
    const noEffectsMeta = { ...richMetadata, aggregate: { ...richMetadata.aggregate, uniqueEffects: [] } };
    const noEffectsPoints = ArweaveVault.computeKulturePoints(noEffectsMeta);
    test('Unique effects earn bonus points', points > noEffectsPoints);

    // 1H: Metadata schema completeness
    test('VideoMetadata has required field: title', richMetadata.title.length > 0);
    test('VideoMetadata has required field: creator', richMetadata.creator.length > 0);
    test('VideoMetadata has required field: durationSeconds', richMetadata.durationSeconds > 0);
    test('VideoMetadata has required field: aesthetic', richMetadata.aesthetic.length > 0);
    test('VideoMetadata has required field: resolution', richMetadata.resolution.length > 0);
    test('ShotMetadata has cameraMotion field', richMetadata.shots[0].cameraMotion.length > 0);
    test('ShotMetadata has lighting field', richMetadata.shots[0].lighting.length > 0);
    test('ShotMetadata has colorGrade field', richMetadata.shots[0].colorGrade.length > 0);
    test('ShotMetadata has genPrompt field', richMetadata.shots[0].genPrompt.length > 0);
    test('ShotMetadata has aiEngine field', richMetadata.shots[0].aiEngine !== undefined);

    // 1I: Query capability exists
    test('queryByMotion method exists', typeof vault.queryByMotion === 'function');
    test('fetchTransaction method exists', typeof vault.fetchTransaction === 'function');
}


// ═══════════════════════════════════════════════════════════════════════
//  CATEGORY 2: KULTURE WIRE (Pillar 2)
//  Vision: Trace viral X/Twitter posts to origin threads
//  NOTE: Frontend was changed to NFT Market, but backend service remains
// ═══════════════════════════════════════════════════════════════════════

async function testCategory2_KultureWire() {
    category('CATEGORY 2: KULTURE WIRE (Origin Tracing Backend)');

    const wire = new KultureWire();

    // 2A: Service instantiation
    test('KultureWire service can be instantiated', wire !== null);

    // 2B: Trace origin (demo mode — no Twitter API key)
    const report = await wire.traceOrigin('functional_test_tweet_001');
    test('traceOrigin returns a WireReport', report !== null);

    if (report) {
        // 2C: Report contains origin data
        test('Report has eventTitle', report.eventTitle.length > 0);
        test('Report has originPostId', report.originPostId.length > 0);
        test('Report has originAuthor', report.originAuthor.length > 0);
        test('Report has originTimestamp (ISO string)', report.originTimestamp.length > 0);
        test('Report platform is X', report.platform === 'x');

        // 2D: Strands (thread replies)
        test('Report has strands (> 0)', report.strands.length > 0);
        test('Strand count matches strands array', report.strandCount === report.strands.length);

        // 2E: Strand engagement data
        const strand = report.strands[0];
        test('Strand has postId', strand.postId.length > 0);
        test('Strand has author', strand.author.length > 0);
        test('Strand has text content', strand.text.length > 0);
        test('Strand has engagement.likes (>= 0)', strand.engagement.likes >= 0);
        test('Strand has engagement.retweets (>= 0)', strand.engagement.retweets >= 0);
        test('Strand has engagement.replies (>= 0)', strand.engagement.replies >= 0);

        // 2F: Cultural tags
        test('Report has cultural tags', report.culturalTags.length > 0);
        test('Tags are lowercase hashtags', report.culturalTags.every((t: string) => t.startsWith('#')));

        // 2G: Arweave archival
        test('Report has arweaveTxId (archived)', report.arweaveTxId !== undefined && report.arweaveTxId!.length > 0);
    }

    // 2H: Trending scan
    const reports = await wire.scanTrending();
    test('scanTrending returns reports', reports.length > 0);
    test('First trending report has a title', reports[0].eventTitle.length > 0);
}


// ═══════════════════════════════════════════════════════════════════════
//  CATEGORY 3: BEST VIDEO OF THE YEAR CONTEST (Pillar 3)
//  Vision: Vote-based contest, 0.0009 SOL/vote, anti-spam, prize dist.
// ═══════════════════════════════════════════════════════════════════════

async function testCategory3_VoteContest() {
    category('CATEGORY 3: BEST VIDEO CONTEST (Solana Voting)');

    const contest = new KultureVoteClient();

    // 3A: Constants match vision
    test('Vote cost is 0.0009 SOL', KultureVoteClient.VOTE_COST_SOL === 0.0009);
    test('Vote cost in lamports is 900000', KultureVoteClient.VOTE_COST_LAMPORTS === 900000);
    test('Max votes per wallet per video is 3', KultureVoteClient.MAX_VOTES_PER_WALLET === 3);

    // 3B: Video registration
    contest.registerVideo('func_vid_001', 'Afrofuturist Dream', 'alice_wallet', 'arweave_tx_001');
    contest.registerVideo('func_vid_002', 'Digital Ancestry', 'bob_wallet', 'arweave_tx_002');
    contest.registerVideo('func_vid_003', 'Chain of Heritage', 'carol_wallet', 'arweave_tx_003');
    contest.registerVideo('func_vid_004', 'Neon Griot', 'dave_wallet', 'arweave_tx_004');
    contest.registerVideo('func_vid_005', 'Permaweb Legacy', 'eve_wallet', 'arweave_tx_005');
    contest.registerVideo('func_vid_006', 'Culture Code', 'frank_wallet', 'arweave_tx_006');

    let standings = contest.getStandings();
    test('6 videos registered successfully', standings.entries.length === 6);

    // 3C: Duplicate registration is blocked
    contest.registerVideo('func_vid_001', 'Duplicate', 'alice_wallet', 'arweave_tx_dup');
    standings = contest.getStandings();
    test('Duplicate video registration blocked (still 6)', standings.entries.length === 6);

    // 3D: Voting works
    const receipt = await contest.castVote('voter_1', 'func_vid_001');
    test('Vote returns a receipt', receipt !== null);
    test('Receipt has voter field', receipt!.voter === 'voter_1');
    test('Receipt has videoId field', receipt!.videoId === 'func_vid_001');
    test('Receipt has costLamports', receipt!.costLamports === 900000);
    test('Receipt has timestamp', receipt!.timestamp.length > 0);
    test('Receipt has transactionSignature', receipt!.transactionSignature.length > 0);

    // 3E: Multiple votes from different wallets
    await contest.castVote('voter_2', 'func_vid_001');
    await contest.castVote('voter_3', 'func_vid_001');
    await contest.castVote('voter_1', 'func_vid_002');
    await contest.castVote('voter_2', 'func_vid_002');
    await contest.castVote('voter_1', 'func_vid_003');
    await contest.castVote('voter_2', 'func_vid_004');
    await contest.castVote('voter_3', 'func_vid_005');
    await contest.castVote('voter_1', 'func_vid_006');

    standings = contest.getStandings();
    test('Total votes tracked correctly (9)', standings.totalVotes === 9);
    test('Prize pool accumulates (9 * 0.0009 SOL)', Math.abs(standings.prizePoolSol - 0.0081) < 0.0001);

    // 3F: Anti-spam — max 3 votes per wallet per video
    await contest.castVote('voter_1', 'func_vid_001'); // 2nd vote
    await contest.castVote('voter_1', 'func_vid_001'); // 3rd vote — should succeed
    const blockedVote = await contest.castVote('voter_1', 'func_vid_001'); // 4th vote — should FAIL
    test('Anti-spam: 4th vote from same wallet is BLOCKED', blockedVote === null);

    // 3G: Vote for non-existent video
    const badVote = await contest.castVote('voter_1', 'nonexistent_video');
    test('Vote for non-existent video returns null', badVote === null);

    // 3H: Standings are sorted by votes (descending)
    standings = contest.getStandings();
    const sortedCorrectly = standings.entries.every((entry, i) => {
        if (i === 0) return true;
        return standings.entries[i - 1].votes >= entry.votes;
    });
    test('Standings sorted by votes (descending)', sortedCorrectly);

    // 3I: Execute contest — prize distribution
    const result = await contest.executeContest();
    test('Contest execution succeeds', result !== null);
    test('Contest has winners', result.winners.length > 0);
    test('1st place gets 40%', result.winners[0].percentage === 40);
    test('1st place is the most-voted video', result.winners[0].videoId === 'func_vid_001');

    // 3J: Runners-up get 6% each
    if (result.winners.length > 1) {
        test('2nd place gets 6%', result.winners[1].percentage === 6);
    }
    if (result.winners.length > 2) {
        test('3rd place gets 6%', result.winners[2].percentage === 6);
    }

    // 3K: Prize pool lamports tracked
    test('Prize pool lamports > 0', result.prizePoolLamports > 0);
    test('Total votes cast tracked', result.totalVotesCast > 0);
    test('Contest has execution timestamp', result.executedAt.length > 0);
    test('Contest has transaction signature', result.transactionSignature.length > 0);
}


// ═══════════════════════════════════════════════════════════════════════
//  CATEGORY 4: NFT MARKETPLACE (New Pillar 2 — Frontend)
//  Vision (new): Mint art, music, photos, merch as NFTs
//  NOTE: This is a frontend-only feature currently (no backend service)
// ═══════════════════════════════════════════════════════════════════════

async function testCategory4_NFTMarket() {
    category('CATEGORY 4: NFT MARKETPLACE (Frontend Feature)');

    // Since the NFT marketplace is frontend-only, we verify file existence
    // and expected structure via imports/assertions
    const fs = await import('fs');
    const path = await import('path');

    const marketPagePath = path.resolve(import.meta.dirname || '.', '../web/app/market/page.tsx');
    const marketExists = fs.existsSync(marketPagePath);
    test('NFT Market page exists at /web/app/market/page.tsx', marketExists);

    if (marketExists) {
        const content = fs.readFileSync(marketPagePath, 'utf-8');
        test('Market page has Art & Photos section', content.includes('Art & Photos'));
        test('Market page has Music & Audio section', content.includes('Music & Audio'));
        test('Market page has Merch section', content.includes('Merch'));
        test('Market page has Fashion section', content.includes('Fashion'));
        test('Market page has MINT buttons', content.includes('MINT'));
        test('Market page has Featured Drops section', content.includes('Featured Drops'));
        test('Market page uses Framer Motion animations', content.includes('motion'));
        test('Market page has BUY NOW button', content.includes('BUY NOW'));
    }

    // Verify the old wire page was properly replaced
    const oldWirePagePath = path.resolve(import.meta.dirname || '.', '../web/app/wire/page.tsx');
    const wirePageGone = !fs.existsSync(oldWirePagePath);
    test('Old /wire page removed (replaced by /market)', wirePageGone);

    info('NOTE: NFT minting backend service still needs implementation');
    info('Current state: UI-only placeholder — no Solana minting logic yet');
}


// ═══════════════════════════════════════════════════════════════════════
//  CATEGORY 5: CROSS-PILLAR INTEGRATION
//  Vision: Upload → Register → Vote → Verify pipeline
// ═══════════════════════════════════════════════════════════════════════

async function testCategory5_Integration() {
    category('CATEGORY 5: CROSS-PILLAR INTEGRATION PIPELINE');

    const vault = new ArweaveVault();
    const contest = new KultureVoteClient();
    const wire = new KultureWire();

    // 5A: Full pipeline — Upload → Compute Points → Register → Vote → Verify
    const metadata = createRichVideoMetadata();

    // Step 1: Compute Kulture Points
    metadata.platform.kulturePoints = ArweaveVault.computeKulturePoints(metadata);
    test('Step 1: Kulture Points computed', metadata.platform.kulturePoints > 0);
    info(`Kulture Points: ${metadata.platform.kulturePoints}`);

    // Step 2: Upload to Arweave
    const txId = await vault.uploadMetadata(metadata);
    test('Step 2: Video uploaded to Arweave', txId.length > 0);
    info(`Arweave TX: ${txId}`);

    // Step 3: Register for contest
    contest.registerVideo('pipeline_vid', metadata.title, metadata.creator, txId);
    const standings = contest.getStandings();
    test('Step 3: Video registered for contest', standings.entries.length === 1);
    test('Contest entry linked to Arweave TX', standings.entries[0].arweaveTxId === txId);

    // Step 4: Vote for the video
    const vote = await contest.castVote('pipeline_voter_1', 'pipeline_vid');
    test('Step 4: Vote cast successfully', vote !== null);

    // Step 5: Verify prize pool updated
    const updatedStandings = contest.getStandings();
    test('Step 5: Prize pool reflects vote', Math.abs(updatedStandings.prizePoolSol - 0.0009) < 0.0001);
    test('Vote count = 1', updatedStandings.totalVotes === 1);

    // Step 6: Wire report (parallel feature)
    const wireReport = await wire.traceOrigin('pipeline_tweet');
    test('Step 6: Wire report generated in parallel', wireReport !== null);

    console.log('\n    🔗 Full Pipeline: Points → Upload → Register → Vote → Verify → Wire ✅');
}


// ═══════════════════════════════════════════════════════════════════════
//  CATEGORY 6: API ROUTES (Frontend ↔ Backend)
//  Vision: /api/contest/standings, /api/contest/vote, /api/wire/trace
// ═══════════════════════════════════════════════════════════════════════

async function testCategory6_APIRoutes() {
    category('CATEGORY 6: API ROUTES (File Existence)');

    const fs = await import('fs');
    const path = await import('path');
    const basePath = path.resolve(import.meta.dirname || '.', '../web/app/api');

    test('API route exists: /api/contest/standings/route.ts',
        fs.existsSync(path.join(basePath, 'contest/standings/route.ts')));
    test('API route exists: /api/contest/vote/route.ts',
        fs.existsSync(path.join(basePath, 'contest/vote/route.ts')));
    test('API route exists: /api/wire/trace/route.ts',
        fs.existsSync(path.join(basePath, 'wire/trace/route.ts')));

    // Verify API route contents
    const standingsContent = fs.readFileSync(path.join(basePath, 'contest/standings/route.ts'), 'utf-8');
    test('Standings API returns mock videos', standingsContent.includes('mockVideos'));
    test('Standings API calculates prize pool', standingsContent.includes('prizePoolSol'));

    const voteContent = fs.readFileSync(path.join(basePath, 'contest/vote/route.ts'), 'utf-8');
    test('Vote API accepts POST requests', voteContent.includes('POST'));
    test('Vote API requires videoId and voter', voteContent.includes('videoId') && voteContent.includes('voter'));
    test('Vote API returns receipt with signature', voteContent.includes('transactionSignature'));

    const wireContent = fs.readFileSync(path.join(basePath, 'wire/trace/route.ts'), 'utf-8');
    test('Wire API accepts GET with tweetId', wireContent.includes('tweetId'));
    test('Wire API returns demo data as fallback', wireContent.includes('demo'));
}


// ═══════════════════════════════════════════════════════════════════════
//  CATEGORY 7: FRONTEND PAGES (UI Existence)
// ═══════════════════════════════════════════════════════════════════════

async function testCategory7_FrontendPages() {
    category('CATEGORY 7: FRONTEND PAGES & DESIGN');

    const fs = await import('fs');
    const path = await import('path');
    const webApp = path.resolve(import.meta.dirname || '.', '../web/app');

    // Page existence
    test('Landing page exists: /app/page.tsx', fs.existsSync(path.join(webApp, 'page.tsx')));
    test('Vault page exists: /app/vault/page.tsx', fs.existsSync(path.join(webApp, 'vault/page.tsx')));
    test('Market page exists: /app/market/page.tsx', fs.existsSync(path.join(webApp, 'market/page.tsx')));
    test('Contest page exists: /app/contest/page.tsx', fs.existsSync(path.join(webApp, 'contest/page.tsx')));
    test('Layout exists: /app/layout.tsx', fs.existsSync(path.join(webApp, 'layout.tsx')));
    test('Global CSS exists: /app/globals.css', fs.existsSync(path.join(webApp, 'globals.css')));

    // Landing page content checks
    const landingContent = fs.readFileSync(path.join(webApp, 'page.tsx'), 'utf-8');
    test('Landing has TOKENIZED title', landingContent.includes('TOKENIZED'));
    test('Landing has KULTURE title', landingContent.includes('KULTURE'));
    test('Landing has EXPLORE VAULT link', landingContent.includes('EXPLORE VAULT'));
    test('Landing has NFT MARKET link', landingContent.includes('NFT MARKET'));
    test('Landing has THREE PILLARS section', landingContent.includes('THREE PILLARS'));
    test('Landing has hip-hop character images', landingContent.includes('hip-hop-left'));
    test('Landing has 4 character images (2 per side)', landingContent.includes('hip-hop-left-top') && landingContent.includes('hip-hop-right-top'));
    test('Landing uses Framer Motion', landingContent.includes('motion'));

    // Image assets
    const publicImages = path.resolve(import.meta.dirname || '.', '../web/public/images');
    test('Image: hip-hop-left.png exists', fs.existsSync(path.join(publicImages, 'hip-hop-left.png')));
    test('Image: hip-hop-right.png exists', fs.existsSync(path.join(publicImages, 'hip-hop-right.png')));
    test('Image: hip-hop-left-top.jpg exists', fs.existsSync(path.join(publicImages, 'hip-hop-left-top.jpg')));
    test('Image: hip-hop-right-top.jpg exists', fs.existsSync(path.join(publicImages, 'hip-hop-right-top.jpg')));

    // CSS design system
    const cssContent = fs.readFileSync(path.join(webApp, 'globals.css'), 'utf-8');
    test('CSS has neon text-shadow utility', cssContent.includes('.text-neon'));
    test('CSS has neon-box utility', cssContent.includes('.neon-box'));
    test('CSS has graffiti-text utility', cssContent.includes('.graffiti-text'));
    test('CSS imports Orbitron font', cssContent.includes('Orbitron'));
    test('CSS imports Permanent Marker font', cssContent.includes('Permanent+Marker'));
}


// ═══════════════════════════════════════════════════════════════════════
//  CATEGORY 8: TYPE SYSTEM & SCHEMAS
// ═══════════════════════════════════════════════════════════════════════

async function testCategory8_Types() {
    category('CATEGORY 8: TYPE SYSTEM & SCHEMA VALIDATION');

    // VideoMetadata schema
    const meta = createRichVideoMetadata();
    test('VideoMetadata.title is string', typeof meta.title === 'string');
    test('VideoMetadata.creator is string', typeof meta.creator === 'string');
    test('VideoMetadata.durationSeconds is number', typeof meta.durationSeconds === 'number');
    test('VideoMetadata.aesthetic is string', typeof meta.aesthetic === 'string');
    test('VideoMetadata.resolution is string', typeof meta.resolution === 'string');
    test('VideoMetadata.shots is array', Array.isArray(meta.shots));
    test('VideoMetadata.aggregate is object', typeof meta.aggregate === 'object');
    test('VideoMetadata.platform is object', typeof meta.platform === 'object');

    // ShotMetadata schema
    const shot = meta.shots[0];
    test('ShotMetadata.timestamp is string', typeof shot.timestamp === 'string');
    test('ShotMetadata.type is string', typeof shot.type === 'string');
    test('ShotMetadata.visual is string', typeof shot.visual === 'string');
    test('ShotMetadata.cameraMotion is string', typeof shot.cameraMotion === 'string');
    test('ShotMetadata.motionIntensity is number', typeof shot.motionIntensity === 'number');
    test('ShotMetadata.effects is array', Array.isArray(shot.effects));
    test('ShotMetadata.isAiGenerated is boolean', typeof shot.isAiGenerated === 'boolean');

    // WireReport schema (from traceOrigin)
    const wire = new KultureWire();
    const report = await wire.traceOrigin('schema_test');
    if (report) {
        test('WireReport.eventTitle is string', typeof report.eventTitle === 'string');
        test('WireReport.originPostId is string', typeof report.originPostId === 'string');
        test('WireReport.platform is string', typeof report.platform === 'string');
        test('WireReport.culturalTags is array', Array.isArray(report.culturalTags));
        test('WireReport.strands is array', Array.isArray(report.strands));
        test('WireReport.strandCount is number', typeof report.strandCount === 'number');
    }
}


// ═══════════════════════════════════════════════════════════════════════
//  RUN ALL CATEGORIES
// ═══════════════════════════════════════════════════════════════════════

async function runAllFunctionalTests() {
    console.log('\n' + '█'.repeat(70));
    console.log('█  TOKENIZED KULTURE — FUNCTIONAL TEST SUITE');
    console.log('█  Vision-to-Codebase Alignment Verification');
    console.log(`█  ${new Date().toISOString()}`);
    console.log('█'.repeat(70));

    try {
        await testCategory1_VideoVault();
        await testCategory2_KultureWire();
        await testCategory3_VoteContest();
        await testCategory4_NFTMarket();
        await testCategory5_Integration();
        await testCategory6_APIRoutes();
        await testCategory7_FrontendPages();
        await testCategory8_Types();
    } catch (error) {
        console.error('\n💥 FATAL ERROR:', error);
        totalFailed++;
    }

    // Final category summary
    if (currentCategory) {
        console.log(`\n  📊 ${currentCategory}: ${categoryPassed} passed, ${categoryFailed} failed`);
    }

    console.log('\n' + '█'.repeat(70));
    console.log(`█  FINAL RESULTS: ${totalPassed} passed, ${totalFailed} failed, ${totalPassed + totalFailed} total`);
    console.log('█'.repeat(70));

    if (totalFailed > 0) {
        console.log('❌ SOME TESTS FAILED — Review alignment issues above');
        process.exit(1);
    } else {
        console.log('✅ ALL FUNCTIONAL TESTS PASSED — Vision and codebase are aligned');
        process.exit(0);
    }
}

runAllFunctionalTests();
