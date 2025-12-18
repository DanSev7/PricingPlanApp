// screens/TeamScreen.tsx (Refined, Modern Grid Layout)
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// --- Color Constants ---
const BG_COLOR = '#0f172b';
const CARD_COLOR = '#1d293b';
const TINT_COLOR = '#09b6d4';
const TEXT_COLOR = '#ffffff';

// Define the team member type
interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageAsset: any; // Local asset
  email: string;
}

// Team member data
const teamMembers: TeamMember[] = [
    {
        id: '1',
        name: "Mr. Ephrem Gebeyehu",
        role: "CEO and Founder of Ethiotech Leaders",
        imageAsset: require('@/assets/images/Ephrem-G.jpg'),
        email: "ephrem.gebeyehu@ethiotechleaders.com"
    },
    {
        id: '2',
        name: "Sara Ayele",
        role: "Mobile App Developer",
        imageAsset: require('@/assets/images/Sarah-A.jpg'),
        email: "ergibayele7@gmail.com"
    },
    {
        id: '3',
        name: "Daniel Ayele",
        role: "Web app Developer",
        imageAsset: require('@/assets/images/Daniel-A.jpg'),
        email: "danielayele077@gmail.com"
    }
];

// Helper Component for a single team member card
const TeamMemberCard = ({ name, role, imageAsset, onPress }: any) => {
    return (
        <TouchableOpacity 
            style={[teamStyles.memberCard, { backgroundColor: CARD_COLOR }]}
            onPress={onPress}
            activeOpacity={0.7} // Reduced opacity for subtle feedback
        >
            <Image
                source={imageAsset}
                style={teamStyles.memberImage}
                contentFit="cover"
            />
            <ThemedText style={[teamStyles.memberName, { color: TEXT_COLOR }]}>
                {name}
            </ThemedText>
            <ThemedText style={[teamStyles.memberRole, { color: TINT_COLOR }]}>
                {role}
            </ThemedText>
        </TouchableOpacity>
    );
};

export default function TeamScreen() {
    const router = useRouter();

    const ceo = teamMembers[0];
    const otherMembers = teamMembers.slice(1);

    const navigateToDetail = (member: TeamMember) => {
        router.push({
            pathname: '/screens/team-detail',
            params: {
                name: member.name,
                role: member.role,
                imageAsset: member.imageAsset, // Pass local asset directly
                email: member.email
            },
        });
    };

    return (
        <ThemedView style={[teamStyles.container, { backgroundColor: BG_COLOR }]}>
            <ParallaxScrollView
                headerBackgroundColor={{ light: BG_COLOR, dark: BG_COLOR }}
                headerImage={
                    <View style={teamStyles.headerImage}>
                        <Ionicons name="people-circle-outline" size={150} color={TINT_COLOR} />
                    </View>
                }
            >
                {/* Back Arrow */}
                {/* <TouchableOpacity 
                    style={teamStyles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={26} color={TEXT_COLOR} />
                </TouchableOpacity> */}
                
                {/* Unified Screen Header */}
                <ScreenHeader 
                  title="Our Leadership Team" 
                  subtitle="Meet the experts driving time optimization and innovation."
                />
                
                {/* 3. CEO Section (Standalone Card) */}
                <ThemedView style={[teamStyles.ceoSection, { backgroundColor: CARD_COLOR }]}>
                    <ThemedText type="subtitle" style={[teamStyles.sectionHeading,]}>
                        Executive Leader
                    </ThemedText>
                    <TeamMemberCard 
                        name={ceo.name}
                        role={ceo.role}
                        imageAsset={ceo.imageAsset}
                        onPress={() => navigateToDetail(ceo)}
                    />
                </ThemedView>

                {/* 4. Other Team Members Grid */}
                <ThemedView style={[teamStyles.teamGridSection, { backgroundColor: CARD_COLOR }]}>
                    <ThemedText type="subtitle" style={[teamStyles.sectionHeading,]}>
                        IT Professionals
                    </ThemedText>
                    <View style={teamStyles.memberGrid}>
                        {otherMembers.map((member) => (
                            <View key={member.id} style={teamStyles.gridItem}>
                                <TeamMemberCard
                                    name={member.name}
                                    role={member.role}
                                    imageAsset={member.imageAsset}
                                    onPress={() => navigateToDetail(member)}
                                />
                            </View>
                        ))}
                    </View>
                </ThemedView>

                <View style={{ height: 40 }} />
            </ParallaxScrollView>
        </ThemedView>
    );
}

const teamStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0, // Removed unnecessary paddingTop
    },
    headerImage: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // --- Back Button Styles (Fixed & Professional) ---
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 10,
        backgroundColor: 'rgba(15, 23, 43, 0.9)', // Dark background with higher opacity
        borderRadius: 20,
        elevation: 8, // Increased elevation
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 8 }, // Increased shadow offset
        shadowOpacity: 1,
        shadowRadius: 6,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 5,
    },
    // --- End Back Button Styles ---
    
    titleContainer: {
        paddingHorizontal: 12,
        marginBottom: 20, // Increased spacing
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 30, // Larger title
        fontWeight: '600', // Bolder title
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.9,
        marginTop: 8,
    },
    
    sectionHeading: {
        fontSize: 20,
        fontWeight: '600',
        color: TINT_COLOR,
        marginBottom: 16,
        textAlign: 'center',
    },
    
    ceoSection: {
        margin: 20,
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    
    teamGridSection: {
        margin: 20,
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    
    memberGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    
    gridItem: {
        width: '48%', // Two columns with some spacing
        marginBottom: 16,
    },
    
    memberCard: {
        borderRadius: 16,
        overflow: 'hidden',
        alignItems: 'center',
        padding: 16,
    },
    
    memberImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: TINT_COLOR,
    },
    
    memberName: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    
    memberRole: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.8,
    },
});
