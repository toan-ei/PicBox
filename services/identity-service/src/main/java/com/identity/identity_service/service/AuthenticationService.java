package com.identity.identity_service.service;

import com.identity.identity_service.dto.request.AuthenticationRequest;
import com.identity.identity_service.dto.request.CheckTokenRequest;
import com.identity.identity_service.dto.request.LogoutRequest;
import com.identity.identity_service.dto.request.RefreshRequest;
import com.identity.identity_service.dto.response.AuthenticationResponse;
import com.identity.identity_service.dto.response.CheckTokenResponse;
import com.identity.identity_service.dto.response.LogoutResponse;
import com.identity.identity_service.entity.InvalidatedToken;
import com.identity.identity_service.entity.User;
import com.identity.identity_service.exception.ApplicationException;
import com.identity.identity_service.exception.ErrorCode;
import com.identity.identity_service.repository.InvalidateRepository;
import com.identity.identity_service.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    UserRepository userRepository;
    InvalidateRepository invalidateRepository;
    @NonFinal
    @Value("${jwt.signerKey}")
    String signerKey;
    @NonFinal
    @Value("${jwt.valid-duration}")
    int validDuration;
    @NonFinal
    @Value("${jwt.refreshable-duration}")
    int refreshableDuration;

    public AuthenticationResponse authenticated(AuthenticationRequest request){
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(!authenticated){
            throw new ApplicationException(ErrorCode.UNAUTHENTICATED);
        }
        String token = generateToken(user);
        return AuthenticationResponse.builder()
                .valid(true)
                .token(token)
                .build();
    }

    public CheckTokenResponse checkToken(CheckTokenRequest request) throws ParseException, JOSEException {
        var token = request.getToken();
        boolean isValid = true;
        try{
            verifyToken(token, false);
        }
        catch (ApplicationException e){
            isValid = false;
        }
        return CheckTokenResponse.builder()
                .valid(isValid)
                .build();
    }

    public LogoutResponse logout(LogoutRequest request) throws ParseException, JOSEException {
        try{
            var signedJwt = verifyToken(request.getToken(), true);
            InvalidatedToken invalidatedToken = new InvalidatedToken();
            invalidatedToken.setId(signedJwt.getJWTClaimsSet().getJWTID());
            invalidatedToken.setExpiryTime(signedJwt.getJWTClaimsSet().getExpirationTime());
            invalidateRepository.save(invalidatedToken);
        } catch (ApplicationException applicationException){
            log.info("token already expiry");
        }
        return LogoutResponse.builder()
                .isValid(true)
                .build();
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var singedjwt = verifyToken(request.getToken(), true);

        String idToken = singedjwt.getJWTClaimsSet().getJWTID();
        Date expiryTime = singedjwt.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(idToken)
                .expiryTime(expiryTime)
                .build();
        invalidateRepository.save(invalidatedToken);

        String userId = singedjwt.getJWTClaimsSet().getSubject();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));
        String token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .valid(true)
                .build();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier jwsVerifier = new MACVerifier(signerKey.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        String tokenId = signedJWT.getJWTClaimsSet().getJWTID();
        if (invalidateRepository.existsById(tokenId)){
            throw new ApplicationException(ErrorCode.UNAUTHORIZED);
        }
        Date expireTime = (isRefresh) ?
                new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                        .toInstant().plus(refreshableDuration, ChronoUnit.MINUTES).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();
        var verifier = signedJWT.verify(jwsVerifier);
        if(!(verifier && expireTime.after(new Date()))){
            throw new ApplicationException(ErrorCode.UNAUTHENTICATED);
        }
        return signedJWT;
    }

    private String generateToken(User user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(validDuration, ChronoUnit.MINUTES).toEpochMilli()))
                .issuer("em toan nghien code")
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();
        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user){
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRoles())){
            user.getRoles().forEach(role -> {
                stringJoiner.add(role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())){
                    role.getPermissions().forEach(permission -> {
                        stringJoiner.add(permission.getName());
                    });
                }
            });
        }
        return stringJoiner.toString();
    }
}
